---
title: "Machine images for vSphere"
date: 2022-01-08
tags: ["homelab", "ubuntu", "vmware", "vsphere"]
description: "Semi-automated Ubuntu image builds - part 1"
---

As a VMware homelab enthusiast I'm always looking for ways to streamline my vSphere environment. As it turns out, being able to quickly stamp out VMs from images cuts down on toil and IMO a core capability of any respectable at-home data-center :sunglasses:.

This runbook is based on the fine work of [Myles @ blah.cloud](https://blah.cloud/). All credit goes to him for providing the procedure [here](https://blah.cloud/kubernetes/creating-an-ubuntu-18-04-lts-cloud-image-for-cloning-on-vmware/). This post is simply my means of implementing and documenting the process as I search for the best way to bake machine images.

For a while now I've been using [terraform](https://github.com/corbtastik/terraform-vmware-ubuntu) to provision VMs on vSphere, it works great but doesn't address building the actual machine image, which is mainly what I'm trying to nail down.

> So the question on the table is - What's the best way to create machine images in a vSphere environment?

* Ideally the process should be completely automated.
  * _Or pose little friction to being automated with some elbow grease._
* The process should be able to build images for different operating systems and versions.

Since I mainly use Ubuntu, the [build process from Myles](https://blah.cloud/kubernetes/creating-an-ubuntu-18-04-lts-cloud-image-for-cloning-on-vmware/) is a good first crack at automating the build. The docs below outline the process, it works and with a bit of effort I think could be completely automated.

__Automation areas to address:__

1. Automating the OVA to OVF spec process.
  * _Complete with entering values for each OVF field._
1. The initial template VM power-on and change password.
  * _Currently this requires interaction over SSH._
1. Creating vSphere customization specs.
  * _Needed for VM instances to customize hostname, networking and DNS at provision time._

> I may circle back and take a crack at automating this process after I research alternative methods.

### Tooling

* __Required:__
  * __govc:__ [vSphere CLI](https://github.com/vmware/govmomi/tree/master/govc)
* __Optional:__
  * __pwsh:__ [PowerShell](https://github.com/PowerShell/PowerShell)
  * __VMware PowerCLI:__ [PowerCLI module](https://developer.vmware.com/web/tool/12.4/vmware-powercli)

### Setup govc

* Configure govc to connect with your vCenter server as documented [here](https://github.com/vmware/govmomi/tree/master/govc#usage).

### Download Ubuntu cloudimg OVA

```bash
$ curl -LO https://cloud-images.ubuntu.com/releases/bionic/release/ubuntu-18.04-server-cloudimg-amd64.ova
```

### Extract OVF spec from the OVA

```bash
$ govc import.spec ./ubuntu-18.04-server-cloudimg-amd64.ova > ubuntu-bionic-ovf.json
```

### Edit OVF spec

The values will depend on your tastes and vSphere environment but add values for at least the following.

* **Name**: Name of VM template.
* **hostname**: Hostname of VM.
* **public-keys**: SSH public key used to access VM
    * `ssh-keygen -t rsa -b 2048 -C "you@somewhere.io"`
* **password**: Password for "ubuntu" user, this will be changed on first login.
* **Network**: The network in vSphere where this VM will run.
    * **Note:** this network must have a DHCP server to hand out IP addresses.

```json
{
  "Name": "ubuntu-bionic-template",
  "PropertyMapping": [
    {
      "Key": "instance-id",
      "Value": "id-ovf"
    },
    {
      "Key": "hostname",
      "Value": "ubuntu-bionic-template"
    },
    {
      "Key": "seedfrom",
      "Value": ""
    },
    {
      "Key": "public-keys",
      "Value": "ssh-rsa <YOUR-SSH-PUBLIC-KEY-BITS> you@somewhere.io"
    },
    {
      "Key": "user-data",
      "Value": ""
    },
    {
      "Key": "password",
      "Value": "changeME"
    }
  ],
  "NetworkMapping": [
    {
      "Name": "VM Network",
      "Network": "vms-portgroup"
    }
  ],
  "DiskProvisioning": "thin",
  "IPAllocationPolicy": "dhcpPolicy",
  "IPProtocol": "IPv4",
  "MarkAsTemplate": false,
  "PowerOn": false,
  "InjectOvfEnv": false,
  "WaitForIP": false
}
```

### Deploy template VM

```bash
$ govc import.ova -options=./ubuntu-bionic-ovf.json -ds=ds2 -folder=ubuntu-images ./ubuntu-18.04-server-cloudimg-amd64.ova
# technically enableUUID is only needed it VM instances are going to be used in K8s with vSphere CSI
$ govc vm.change -vm=ubuntu-bionic-template -c=4 -m=4096 -e="disk.enableUUID=1"
$ govc vm.disk.change -vm=ubuntu-bionic-template -disk.label="Hard disk 1" -size=64G
$ govc vm.power -on=true ubuntu-bionic-template

# get IP address
$ govc vm.info ubuntu-bionic-template

Name:           ubuntu-bionic-template
  Path:         /retro-dc/vm/ubuntu-images/ubuntu-bionic-template
  UUID:         4215ebfe-fa14-6fe7-36c4-f100468ac7bb
  Guest name:   Ubuntu Linux (64-bit)
  Memory:       4096MB
  CPU:          4 vCPU(s)
  Power state:  poweredOn
  Boot time:    2022-01-09 15:33:34.86444 +0000 UTC
  IP address:   192.168.13.104
  Host:         retro2.retro.io
```

### Prep template VM

```bash
# ssh into VM and change password, which will log you out afterwards
$ ssh ubuntu@192.168.13.104

# ssh back into VM
$ ssh ubuntu@192.168.13.104

# update packages and install VM tools
$ sudo apt update
$ sudo apt install open-vm-tools -y
$ sudo apt upgrade -y
$ sudo apt autoremove -y

# disable cloud-init to use VMware Customization Spec for hostname and IP assignment
$ sudo cloud-init clean --logs
$ sudo touch /etc/cloud/cloud-init.disabled
$ sudo rm -rf /etc/netplan/50-cloud-init.yaml
$ sudo apt purge cloud-init -y
$ sudo apt autoremove -y

# disable startup params and adjust startup order of open-vm-tools so VMware customizations work
$ sudo sed -i 's/D \/tmp 1777 root root -/#D \/tmp 1777 root root -/g' /usr/lib/tmpfiles.d/tmp.conf
# Remove cloud-init and rely open-vm-tools
$ sudo sed -i 's/Before=cloud-init-local.service/After=dbus.service/g' /lib/systemd/system/open-vm-tools.service
```

### Cleanup template VM

```bash
# cleanup current ssh keys so templated VMs get fresh key
$ sudo rm -f /etc/ssh/ssh_host_*

# add check for ssh keys on reboot...regenerate if neccessary
$ sudo tee /etc/rc.local >/dev/null <<EOL
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#

# By default this script does nothing.
test -f /etc/ssh/ssh_host_dsa_key || dpkg-reconfigure openssh-server
exit 0
EOL

# make the script executable
$ sudo chmod +x /etc/rc.local

# cleanup apt
$ sudo apt clean

# reset the machine-id (DHCP leases in 18.04 are generated based on this... not MAC...)
$ echo "" | sudo tee /etc/machine-id >/dev/null

# cleanup shell history and shutdown for templating
$ history -c
$ history -w
$ sudo shutdown -h now
```

### Mark VM as a template

```bash
$ govc vm.markastemplate ubuntu-bionic-template
```

### Create VM Customization Spec

Options to create VM Customization Spec.

1. Use vCenter: Home > Policies and Profiles > VM Customization Specification > New
2. Use PowerShell: VMware.PowerCLI module

Using vCenter UI makes this step an out-of-band manual task, but it only needs to be done once and can be done ahead of time. If you're wanting automation then PowerShell is your huckleberry.

```bash
$ pwsh
PS> Install-Module -Name VMware.PowerCLI -Scope CurrentUser
PS> Set-PowerCLIConfiguration -InvalidCertificateAction Ignore -Confirm:$false
PS> Connect-VIServer 192.168.13.9 -User administrator@vsphere.retro.io -Password **************
PS> New-OSCustomizationSpec -Name ubuntu-bionic -OSType Linux -DnsServer 192.168.13.3 -DnsSuffix retro.io -Domain retro.io -NamingScheme vm
```

### Clone VMs from VM template

```bash
$ govc vm.clone -vm ubuntu-bionic-template -ds=ds2-nvm6 -customization=ubuntu dev2
$ govc vm.clone -vm ubuntu-focal-template -ds=ds2-nvm6 -customization=ubuntu dev3
```

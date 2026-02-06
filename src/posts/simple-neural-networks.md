---
title: "How Neural Networks Work"
date: 2026-02-03
tags: ["ai", "neural-networks"]
description: "A Brain Analogy 🧠"
---

# How Neural Networks Work — A Brain Analogy 🧠

Our brain has about [80-90 billion neurons](https://en.wikipedia.org/wiki/Neuron). Each one receives signals, decides if they matter, and passes a message forward. A [neural network](https://en.wikipedia.org/wiki/Artificial_neural_network) does the same thing with math.

## Architecture

### Layers

Our brain processes information in stages. Light hits my eyes 👁️. One region detects edges. Another recognizes shapes. Another says "squirrel!" 🐿️

A neural network has **[layers](https://en.wikipedia.org/wiki/Layer_(deep_learning))** that work the same way, networks can have many layers, the inner most are called "hidden".

#### input (layer) -> processing (layer) -> output (layer)

```ascii-art
    INPUT        HIDDEN       OUTPUT
    LAYER        LAYER        LAYER

    [ x1 ]---|   [ h1 ]---|
             |---[    ]   |---[ y1 ]
    [ x2 ]---|   [ h2 ]---|
             |---[    ]   |---[ y2 ]
    [ x3 ]---|   [ h3 ]---|
             |---[    ]
    [ x4 ]---|   [ h4 ]
```

### Neurons

Inside each layer sits **[neurons](https://en.wikipedia.org/wiki/Artificial_neuron)**. A neuron is a cell in our nervous system that collects signals and fires when they're strong enough ⚡. In a network, a neuron is a small math function that does similar, it adds up inputs and decides how strong to respond.

```ascii-art
    A SINGLE NEURON

    input1 --( w1 )-\
                     \
    input2 --( w2 )---[  sum + bias  ]---[ activation ]--- output
                     /
    input3 --( w3 )-/
```

### Weights

Not every signal matters equally.

For example we would (_hopefully_) pay more attention to smoke 💨 rather than to background music 🎵. **[Weights](https://en.wikipedia.org/wiki/Synaptic_weight)** control this. They're numbers on every connection that say "listen to this" or "ignore that" based on their value.

### Biases

Our brain has baseline tendencies. Maybe I startle easily. Maybe I don't. Perhaps I favor taking right turns over left when I'm lost. These are **[Biases](https://en.wikipedia.org/wiki/Bias_(statistics))**; a nudge that makes neurons more or less likely to fire, regardless of input.

### Activation Function

Each neuron also has an **[activation function](https://en.wikipedia.org/wiki/Activation_function)**, which is a rule for how strong to respond. Think of our pain threshold. A light tap does nothing. A hard knock makes us pull away. The activation function sets that threshold.

```ascii-art
    An activation function

    Output
      |
    1 |            ..............
      |          .
      |        .
      |      .
    0 |.....
      +------------------------
              Input -->

      Small inputs: Neuron stays quiet
      Large inputs: Neuron fires
```

### Forward Pass

When signals moves through all the layers from input to output, that's called the **[forward pass](https://en.wikipedia.org/wiki/Feedforward_neural_network)**. It's the network "thinking", not learning (yet).

Just signal in, answer out.

## Learning

### Loss Function

The network starts with random weights. It guesses wrong. The **[loss function](https://en.wikipedia.org/wiki/Loss_function)** measures how wrong, like the sting of touching a hot stove 🔥. Bigger mistake, bigger sting.

### Backpropagation

Now it needs to fix itself. **[Backpropagation](https://en.wikipedia.org/wiki/Backpropagation)** traces the error backward through the network, figuring out which weights caused the most damage. We do this too: "I should have checked the burner before touching."

```ascii-art
    FORWARD PASS (thinking):

    input ---------> [ layer ] --> [ layer ] --> [ layer ] --> prediction
                                                                   |
                                                         compare to right answer
                                                                   |
                                                                 loss
                                                                   |
    adjust weights <-- [ layer ] <-- [ layer ] <-- [ layer ] <-- blame

    BACKPROPAGATION (learning):
```

### Gradient

The **[gradient](https://en.wikipedia.org/wiki/Gradient)** tells each weight which direction to move and how far. Picture standing on a hill in fog 🌫️. You can't see the bottom, but feel the slope under your feet.

### Gradient Descent

**[Gradient descent](https://en.wikipedia.org/wiki/Gradient_descent)** is the act of stepping downhill ⛰️ — adjusting every weight to reduce the error.

```ascii-art
    loss
      \
       \    <-- big gradient (steep)
        \
         \.
           '-..__    <-- small gradient (flat)
                  ''--..___
                           *  <-- minimum (goal)

    Start high. Each step follows the slope down.
    The steeper it is, the more we adjust.
```

### Learning Rate

The **[learning rate](https://en.wikipedia.org/wiki/Learning_rate)** controls step size. Too big and you overshoot. Too small and you barely move. The right pace finds the bottom.

Repeat this thousands of times. The weights are trained and the network learns 🎓.

---

## Summary

**Structural Primitives** 🏗️

| Neural Network | Human Brain |
|---|---|
| [Layers](https://en.wikipedia.org/wiki/Layer_(deep_learning)) | Processing stages: senses - recognition - understanding |
| [Neurons](https://en.wikipedia.org/wiki/Artificial_neuron) | Brain cells that collect signals and fire |
| [Weights](https://en.wikipedia.org/wiki/Synaptic_weight) | How much attention we give each signal |
| [Biases](https://en.wikipedia.org/wiki/Bias_(statistics)) | Tendencies: naturally jumpy or calm |
| [Activation Function](https://en.wikipedia.org/wiki/Activation_function) | Our threshold for reacting |
| [Forward Pass](https://en.wikipedia.org/wiki/Feedforward_neural_network) | Thinking: signal in, answer out |

**Learning Mechanics** 📚

| Neural Network | Human Brain |
|---|---|
| [Loss Function](https://en.wikipedia.org/wiki/Loss_function) | The sting of being wrong |
| [Backpropagation](https://en.wikipedia.org/wiki/Backpropagation) | Tracing the blame — "I should have checked the burner" |
| [Gradient](https://en.wikipedia.org/wiki/Gradient) | Feeling which way is downhill and how steep |
| [Gradient Descent](https://en.wikipedia.org/wiki/Gradient_descent) | Actually stepping downhill — adjusting to make fewer mistakes |
| [Learning Rate](https://en.wikipedia.org/wiki/Learning_rate) | How big my steps are — overcorrect and I panic, undercorrect and I never learn |

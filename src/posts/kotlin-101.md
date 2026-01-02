---
title: "Kotlin 101"
date: 2025-12-28
tags: ["tutorial", "kotlin", "programming", "backend"]
description: "A comprehensive guide to learning the Kotlin programming language by building a real-world CLI tool."
---

Welcome to **Kotlin 101**. If you are coming from Java, Python, or even if this is your first foray into statically typed languages, you are in for a treat. Kotlin has rapidly become one of the most beloved languages in the industry because it manages to be concise without being cryptic, and safe without being restrictive.

In this guide, we aren't just going to memorize syntax. We are going to learn the core concepts of the language and immediately apply them to build a productive tool: **A persistent Command Line Interface (CLI) Task Manager** that saves your data to your disk.

Let's dive in.

## Part 1: The Crash Course

Before we build, we need the building blocks. Kotlin runs on the Java Virtual Machine (JVM), meaning it's interoperable with Java, but the syntax is much more modern.

### 1. Variables: `val` vs `var`
Kotlin emphasizes immutability.
*   **`val`**: Read-only (Immutable). Once assigned, it cannot change.
*   **`var`**: Mutable. Can be reassigned.

```kotlin
val appName = "TaskMaster" // Type inferred as String
var tasksCompleted = 0     // Type inferred as Int

tasksCompleted = 1         // OK
// appName = "NewName"     // Error: Val cannot be reassigned
```

### 2. Null Safety
This is Kotlin's superpower. In many languages, accessing a variable that has no value crashes your app (The Billion Dollar Mistake). In Kotlin, variables cannot be `null` by default.

```kotlin
var name: String = "John"
// name = null // Compiler Error!

// To allow nulls, add a ?
var cleanDate: String? = null 
cleanDate = "2025-12-28"
```

### 3. Functions
Functions are first-class citizens.

```kotlin
fun greet(name: String): String {
    return "Hello, $name"
}

// Single-expression syntax (for concise one-liners)
fun double(x: Int) = x * 2
```

### 4. Data Classes
If you've ever written a Java POJO (Plain Old Java Object) with getters, setters, `equals()`, `hashCode()`, and `toString()`, you will cry tears of joy.

```kotlin
// This one line generates all standard methods automatically
data class Task(val id: Int, val description: String, var isDone: Boolean)
```

---

## Part 2: Building "KotList"

Now that we know the basics, let's build something. We will create **KotList**, a CLI tool that lets you add tasks, view them, and saves them to a text file so they persist after you close the program.

### Prerequisites
*   [IntelliJ IDEA](https://www.jetbrains.com/idea/) (Community Edition is free) or VS Code.
*   JDK installed (version 17 or 21 recommended).

### Step 1: Define the Data Structure
Open your IDE and create a file named `Main.kt`. First, we need a way to represent a task.

```kotlin
import java.io.File
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

// A simple data class to hold our task info
data class Task(
    val id: Int,
    val content: String,
    var isCompleted: Boolean = false,
    val createdAt: String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
) {
    // Override toString for a pretty print in the console
    override fun toString(): String {
        val status = if (isCompleted) "[x]" else "[ ]"
        return "$id. $status $content ($createdAt)"
    }
}
```

### Step 2: File Management
We need a way to save and load tasks. We will use standard Kotlin File I/O.

```kotlin
const val FILE_NAME = "tasks.txt"

// Helper to save tasks to a file
fun saveTasks(tasks: List<Task>) {
    val file = File(FILE_NAME)
    // We map our list of Task objects to a list of Strings like "1|Buy Milk|false|2025..."
    val lines = tasks.map { "${it.id}|${it.content}|${it.isCompleted}|${it.createdAt}" }
    file.writeText(lines.joinToString("\n"))
}

// Helper to load tasks from a file
fun loadTasks(): MutableList<Task> {
    val file = File(FILE_NAME)
    if (!file.exists()) return mutableListOf()

    return file.readLines().mapNotNull { line ->
        // Split the line by the pipe character
        val parts = line.split("|")
        if (parts.size == 4) {
            Task(
                id = parts[0].toInt(),
                content = parts[1],
                isCompleted = parts[2].toBoolean(),
                createdAt = parts[3]
            )
        } else null
    }.toMutableList()
}
```

*Note the use of `map` and `mapNotNull`. Kotlin's Collection API is incredibly powerful for transforming data without writing `for` loops.*

### Step 3: The Application Logic
Now we need the "brains" of the operation to handle user input.

```kotlin
fun main() {
    println("Welcome to KotList 1.0")
    val tasks = loadTasks()
    
    // Determine the next ID based on the last task, or 1 if empty
    var nextId = if (tasks.isEmpty()) 1 else tasks.maxOf { it.id } + 1

    while (true) {
        println("\nCommands: (a)dd, (l)ist, (c)omplete, (d)elete, (q)uit")
        print("> ")
        
        // 'when' is Kotlin's powerful switch statement
        when (readlnOrNull()?.trim()?.lowercase()) {
            "a", "add" -> {
                print("Enter task description: ")
                val desc = readlnOrNull().orEmpty()
                if (desc.isNotBlank()) {
                    tasks.add(Task(nextId++, desc))
                    saveTasks(tasks)
                    println("Task added.")
                }
            }
            "l", "list" -> {
                if (tasks.isEmpty()) println("No tasks found.")
                else tasks.forEach { println(it) }
            }
            "c", "complete" -> {
                print("Enter Task ID to complete: ")
                val inputId = readlnOrNull()?.toIntOrNull()
                // Find the task safely
                val task = tasks.find { it.id == inputId }
                if (task != null) {
                    task.isCompleted = true
                    saveTasks(tasks)
                    println("Task marked as done!")
                } else {
                    println("Task not found.")
                }
            }
            "d", "delete" -> {
                 print("Enter Task ID to delete: ")
                 val inputId = readlnOrNull()?.toIntOrNull()
                 val removed = tasks.removeIf { it.id == inputId }
                 if (removed) {
                     saveTasks(tasks)
                     println("Task deleted.")
                 } else {
                     println("Task not found.")
                 }
            }
            "q", "quit" -> {
                println("Goodbye!")
                return // Exits the main function
            }
            else -> println("Unknown command.")
        }
    }
}
```

### Key Kotlin Concepts Used Here:
1.  **`readlnOrNull()`**: Safely reads input without crashing on end-of-stream.
2.  **`?.` (Safe Call)**: We allow input to be null, but only call `.trim()` if it isn't.
3.  **`when` Expression**: Replaces `switch/case` but allows for strings, ranges, and smart logic.
4.  **Lambdas**: `tasks.forEach { println(it) }` uses a lambda expression. `it` is the implicit name of the single parameter.

## Part 3: Running Your Application

If you are in IntelliJ, simply click the Green "Play" triangle next to the `main` function.

If you are using the command line:

1.  Compile: `kotlinc Main.kt -include-runtime -d kotlist.jar`
2.  Run: `java -jar kotlist.jar`

You can now interact with your app!

```text
Commands: (a)dd, (l)ist, (c)omplete, (d)elete, (q)uit
> a
Enter task description: Learn Kotlin
Task added.

Commands: (a)dd, (l)ist, (c)omplete, (d)elete, (q)uit
> l
1. [ ] Learn Kotlin (2025-12-28 14:00)
```

Close the app and run it again. Type `l`. Your task is still there. You've just built a database-backed application (even if that database is a text file!).

## Conclusion

You have learned variables, null safety, data classes, collections, and file I/O, all while building a working tool.

**Where to go next?**
1.  **Coroutines:** For performing asynchronous tasks (like fetching data from the web) without blocking the main thread.
2.  **Ktor or Spring Boot:** To turn this logic into a web server/API.
3.  **Jetpack Compose:** To put a graphical UI on this logic for Android or Desktop.

Happy coding!
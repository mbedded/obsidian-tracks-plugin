# Terminology and guidelines

This document aims to define some terminologies and guidelines for this project.
The goal is to give some common understanding of used terms and/or conventions in the project or the code.

## Task

A `task` is an item of your list, where you manage your tasks.
We prefer the term "task" over terms like "todo" so we can distinguish code-todos (comments)
easier than classes like `TodoItem` when we use search (CTRL-F) in our IDE. 
Furthermore, different services may use different words for a "task".
One service calls it a "task", another one "todo", another one "item" or maybe "ticket".
We want to stick to "task" so we have a common understanding when reading the code.

A task has several properties like "title", "description".
The `title` is mainly the task itself.
The `description` may provide additional information to a task.
The description is any text provided by the user may even be empty.
For example:

**Title:** Water my plants \
**Description:** Water the plants in the garden and the balcony.
The red flower needs more water than the other ones. 

## Structure and prefixes for the localization keys

The localization files are looking like this:

```json
{
  "settings":{ ... },
  "view":{ ... }
}
```

All keys are written using snake-case.
The first level defines the area of the plugin where the localized text is used.
Currently, I'm using the following top-levels:

- Settings: Text used only on the plugin settings page in Obsidian.
- Messages: User-facing messages shown in the UI, such as errors, warnings or status information.
- Commands: Command names shown to users in the Obsidian command palette.
- View: Text used in the plugin interface, for example labels, button text, headings and placeholders.
- Notice: Text used in popup notifications shown to the user.

**View** has some prefixes for its items.
Use prefixes to describe the purpose of a localization key more clearly.
The prefix should indicate how the text is used in the user interface.

Currently, the following prefixes are used:

- Btn: Text used as a button label.
- Head: Text used as a heading, such as a page title, section title or other UI heading (`h1`, `h2`, `h3`...).
- Lbl: Text used as a label for an input field or form element (`label`).
- Plh: Text used as placeholder text inside an input field (`placeholder=..`).
- Txt: General text displayed in the user interface, for example explanatory text, descriptions or paragraphs (e.g. `p` or `span`).

These prefixes make it easier to understand the intended use of a key without checking where it appears in the interface.

Localization keys should stay stable once they are used.
Do not rename a localization key only because the text changed.
Rename a key only when the meaning or usage of the text changes.
If a key is changed, the code and localization files must be updated accordingly.

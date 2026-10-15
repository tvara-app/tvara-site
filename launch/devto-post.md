---
title: Long ChatGPT chats get slow because of the page, not the model
published: false
description: Why a 400-message AI chat stutters, the two CSS properties that fix most of it, and what I learned building a Chrome extension around them.
tags: webdev, css, chrome, ai
---

A conversation that was instant at twenty messages can take a second to respond to a keystroke at four hundred. It is tempting to blame the model, but the model did not get slower. The page did.

I spent a few months on this problem and ended up building [Tvara](https://tvara.pages.dev), a Chrome and Edge extension for long AI chats. This post covers what is actually going on and the part of the fix you can understand in two lines of CSS.

## What makes a long chat heavy

ChatGPT, Claude, Gemini, DeepSeek, Grok and Perplexity all show a conversation as one ever-growing web page. Every message is a piece of that page: paragraphs, code blocks with a separate element per highlighted token, rendered maths, images, copy buttons. A long conversation can be tens of thousands of elements.

Three costs grow together:

- **Layout.** Anything that changes size makes the browser re-measure the page, and that happens while you type.
- **Memory.** Every element carries style and layout data. Long sessions climb into hundreds of megabytes.
- **Streaming.** While an answer is being written, the page updates many times a second, and each update is measured against the whole document.

The slowdown feels sudden because it is a threshold. Once a frame no longer fits in its budget, every interaction stutters.

## What the chat sites do about it

Most of them window the conversation: they mount the recent messages and unload older ones as you scroll. It works, which is why they do it. It also explains a side effect you have probably hit: Ctrl+F stops finding things in a long chat, because that text is no longer in the page.

## Two properties that do most of the work

You cannot reach into a chat site's component tree and remove its nodes. The framework owns them, and deleting them from outside breaks it. You can change how the browser treats them:

```css
.message {
  content-visibility: auto;
  contain-intrinsic-size: auto 320px;
}
```

`content-visibility: auto` tells the browser to skip layout and paint for an element while it is off-screen. Nothing is removed from the DOM. The message is still there for the framework, for accessibility, and for the browser's own find-in-page.

`contain-intrinsic-size` gives each skipped message a placeholder size, so the scrollbar stays honest. The `auto` keyword makes the browser remember the real size once it has rendered the message, so scrolling back up does not jump.

In the extension, messages about a screen and a half either side of the viewport stay awake, so scrolling never shows a blank while the browser catches up. Everything further away sleeps.

## The parts that were harder than the CSS

- **Finding the messages.** Six sites, six DOM structures, and they change without notice. Each site has its own adapter, and a broken adapter can be switched off without taking the rest of the extension down.
- **Search across unloaded messages.** Because the sites unload old messages, the extension keeps its own copy of each conversation on your machine. Search reads that copy, so it finds messages the page no longer holds.
- **Privacy.** The extension reads chats to do all of this, so it does not send chat text anywhere. It has no `tabs`, `history`, `cookies`, `webRequest` or `scripting` permission, and the archive lives in extension storage on your device.

## What else it does

Once you are keeping a local copy of a conversation, other things become possible: a minimap and outline to jump to any message, timestamps on every message, usage-limit tracking from what each site already reports, and export to Markdown or JSON. The speed engine and the minimap are free on every supported site. Pro is a one-time $1 for five devices and adds archive search, encrypted backup and carrying context into a new chat.

## Try it, or just steal the CSS

If you have a chat that has become painful, the two properties above are worth trying in DevTools on your own. If you want it done for you on every supported site, Tvara is on the [Chrome Web Store](https://chromewebstore.google.com/detail/ajpnackhheeafgecocapboccaplcnaje).

I also wrote up [why long AI chats get slow](https://tvara.pages.dev/answers/why-long-ai-chats-get-slow) in more depth, along with [what the context window actually is](https://tvara.pages.dev/answers/ai-chat-glossary) and why the AI forgets the start of a long chat. I'd like to hear what breaks for you in long chats, and which sites I should support next.

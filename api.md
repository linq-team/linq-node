# Chats

Types:

- <code><a href="./src/resources/chats/chats.ts">ChatCreateResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatRetrieveResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatUpdateResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatListResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatSendVoicememoResponse</a></code>

Methods:

- <code title="post /v3/chats">client.chats.<a href="./src/resources/chats/chats.ts">create</a>({ ...params }) -> ChatCreateResponse</code>
- <code title="get /v3/chats/{chatId}">client.chats.<a href="./src/resources/chats/chats.ts">retrieve</a>(chatID) -> ChatRetrieveResponse</code>
- <code title="put /v3/chats/{chatId}">client.chats.<a href="./src/resources/chats/chats.ts">update</a>(chatID, { ...params }) -> ChatUpdateResponse</code>
- <code title="get /v3/chats">client.chats.<a href="./src/resources/chats/chats.ts">list</a>({ ...params }) -> ChatListResponse</code>
- <code title="post /v3/chats/{chatId}/read">client.chats.<a href="./src/resources/chats/chats.ts">markAsRead</a>(chatID) -> void</code>
- <code title="post /v3/chats/{chatId}/voicememo">client.chats.<a href="./src/resources/chats/chats.ts">sendVoicememo</a>(chatID, { ...params }) -> ChatSendVoicememoResponse</code>
- <code title="post /v3/chats/{chatId}/share_contact_card">client.chats.<a href="./src/resources/chats/chats.ts">shareContactCard</a>(chatID) -> void</code>

## Participants

Types:

- <code><a href="./src/resources/chats/participants.ts">ParticipantAddResponse</a></code>
- <code><a href="./src/resources/chats/participants.ts">ParticipantRemoveResponse</a></code>

Methods:

- <code title="post /v3/chats/{chatId}/participants">client.chats.participants.<a href="./src/resources/chats/participants.ts">add</a>(chatID, { ...params }) -> ParticipantAddResponse</code>
- <code title="delete /v3/chats/{chatId}/participants">client.chats.participants.<a href="./src/resources/chats/participants.ts">remove</a>(chatID, { ...params }) -> ParticipantRemoveResponse</code>

## Typing

Methods:

- <code title="post /v3/chats/{chatId}/typing">client.chats.typing.<a href="./src/resources/chats/typing.ts">start</a>(chatID) -> void</code>
- <code title="delete /v3/chats/{chatId}/typing">client.chats.typing.<a href="./src/resources/chats/typing.ts">stop</a>(chatID) -> void</code>

## Messages

Types:

- <code><a href="./src/resources/chats/messages.ts">MessageListResponse</a></code>
- <code><a href="./src/resources/chats/messages.ts">MessageSendResponse</a></code>

Methods:

- <code title="get /v3/chats/{chatId}/messages">client.chats.messages.<a href="./src/resources/chats/messages.ts">list</a>(chatID, { ...params }) -> MessageListResponse</code>
- <code title="post /v3/chats/{chatId}/messages">client.chats.messages.<a href="./src/resources/chats/messages.ts">send</a>(chatID, { ...params }) -> MessageSendResponse</code>

# Messages

Types:

- <code><a href="./src/resources/messages.ts">MessageRetrieveResponse</a></code>
- <code><a href="./src/resources/messages.ts">MessageAddReactionResponse</a></code>
- <code><a href="./src/resources/messages.ts">MessageRetrieveThreadResponse</a></code>

Methods:

- <code title="get /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages.ts">retrieve</a>(messageID) -> MessageRetrieveResponse</code>
- <code title="delete /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages.ts">delete</a>(messageID, { ...params }) -> void</code>
- <code title="post /v3/messages/{messageId}/reactions">client.messages.<a href="./src/resources/messages.ts">addReaction</a>(messageID, { ...params }) -> MessageAddReactionResponse</code>
- <code title="get /v3/messages/{messageId}/thread">client.messages.<a href="./src/resources/messages.ts">retrieveThread</a>(messageID, { ...params }) -> MessageRetrieveThreadResponse</code>

# Attachments

Types:

- <code><a href="./src/resources/attachments.ts">AttachmentCreateResponse</a></code>
- <code><a href="./src/resources/attachments.ts">AttachmentRetrieveResponse</a></code>

Methods:

- <code title="post /v3/attachments">client.attachments.<a href="./src/resources/attachments.ts">create</a>({ ...params }) -> AttachmentCreateResponse</code>
- <code title="get /v3/attachments/{attachmentId}">client.attachments.<a href="./src/resources/attachments.ts">retrieve</a>(attachmentID) -> AttachmentRetrieveResponse</code>

# PhoneNumbers

Types:

- <code><a href="./src/resources/phone-numbers.ts">PhoneNumberListResponse</a></code>

Methods:

- <code title="get /v3/phonenumbers">client.phoneNumbers.<a href="./src/resources/phone-numbers.ts">list</a>() -> PhoneNumberListResponse</code>

# Webhooks

## Subscriptions

Types:

- <code><a href="./src/resources/webhooks/subscriptions.ts">SubscriptionCreateResponse</a></code>
- <code><a href="./src/resources/webhooks/subscriptions.ts">SubscriptionRetrieveResponse</a></code>
- <code><a href="./src/resources/webhooks/subscriptions.ts">SubscriptionUpdateResponse</a></code>
- <code><a href="./src/resources/webhooks/subscriptions.ts">SubscriptionListResponse</a></code>

Methods:

- <code title="post /v3/webhook-subscriptions">client.webhooks.subscriptions.<a href="./src/resources/webhooks/subscriptions.ts">create</a>({ ...params }) -> SubscriptionCreateResponse</code>
- <code title="get /v3/webhook-subscriptions/{subscriptionId}">client.webhooks.subscriptions.<a href="./src/resources/webhooks/subscriptions.ts">retrieve</a>(subscriptionID) -> SubscriptionRetrieveResponse</code>
- <code title="put /v3/webhook-subscriptions/{subscriptionId}">client.webhooks.subscriptions.<a href="./src/resources/webhooks/subscriptions.ts">update</a>(subscriptionID, { ...params }) -> SubscriptionUpdateResponse</code>
- <code title="get /v3/webhook-subscriptions">client.webhooks.subscriptions.<a href="./src/resources/webhooks/subscriptions.ts">list</a>() -> SubscriptionListResponse</code>
- <code title="delete /v3/webhook-subscriptions/{subscriptionId}">client.webhooks.subscriptions.<a href="./src/resources/webhooks/subscriptions.ts">delete</a>(subscriptionID) -> void</code>

## Events

Types:

- <code><a href="./src/resources/webhooks/events.ts">EventListResponse</a></code>

Methods:

- <code title="get /v3/webhook-events">client.webhooks.events.<a href="./src/resources/webhooks/events.ts">list</a>() -> EventListResponse</code>

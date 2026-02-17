# Chats

Types:

- <code><a href="./src/resources/chats/chats.ts">Chat</a></code>
- <code><a href="./src/resources/chats/chats.ts">MessageContent</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatCreateResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatListResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatSendVoicememoResponse</a></code>

Methods:

- <code title="post /v3/chats">client.chats.<a href="./src/resources/chats/chats.ts">create</a>({ ...params }) -> ChatCreateResponse</code>
- <code title="get /v3/chats/{chatId}">client.chats.<a href="./src/resources/chats/chats.ts">retrieve</a>(chatID) -> Chat</code>
- <code title="put /v3/chats/{chatId}">client.chats.<a href="./src/resources/chats/chats.ts">update</a>(chatID, { ...params }) -> Chat</code>
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

- <code><a href="./src/resources/chats/messages.ts">SentMessage</a></code>
- <code><a href="./src/resources/chats/messages.ts">MessageListResponse</a></code>
- <code><a href="./src/resources/chats/messages.ts">MessageSendResponse</a></code>

Methods:

- <code title="get /v3/chats/{chatId}/messages">client.chats.messages.<a href="./src/resources/chats/messages.ts">list</a>(chatID, { ...params }) -> MessageListResponse</code>
- <code title="post /v3/chats/{chatId}/messages">client.chats.messages.<a href="./src/resources/chats/messages.ts">send</a>(chatID, { ...params }) -> MessageSendResponse</code>

# Messages

Types:

- <code><a href="./src/resources/messages.ts">ChatHandle</a></code>
- <code><a href="./src/resources/messages.ts">MediaPart</a></code>
- <code><a href="./src/resources/messages.ts">Message</a></code>
- <code><a href="./src/resources/messages.ts">MessageEffect</a></code>
- <code><a href="./src/resources/messages.ts">Reaction</a></code>
- <code><a href="./src/resources/messages.ts">ReactionType</a></code>
- <code><a href="./src/resources/messages.ts">ReplyTo</a></code>
- <code><a href="./src/resources/messages.ts">TextPart</a></code>
- <code><a href="./src/resources/messages.ts">MessageRetrieveThreadResponse</a></code>

Methods:

- <code title="get /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages.ts">retrieve</a>(messageID) -> Message</code>
- <code title="delete /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages.ts">delete</a>(messageID, { ...params }) -> void</code>
- <code title="post /v3/messages/{messageId}/reactions">client.messages.<a href="./src/resources/messages.ts">addReaction</a>(messageID, { ...params }) -> Reaction</code>
- <code title="get /v3/messages/{messageId}/thread">client.messages.<a href="./src/resources/messages.ts">retrieveThread</a>(messageID, { ...params }) -> MessageRetrieveThreadResponse</code>

# Attachments

Types:

- <code><a href="./src/resources/attachments.ts">SupportedContentType</a></code>
- <code><a href="./src/resources/attachments.ts">AttachmentCreateResponse</a></code>
- <code><a href="./src/resources/attachments.ts">AttachmentRetrieveResponse</a></code>

Methods:

- <code title="post /v3/attachments">client.attachments.<a href="./src/resources/attachments.ts">create</a>({ ...params }) -> AttachmentCreateResponse</code>
- <code title="get /v3/attachments/{attachmentId}">client.attachments.<a href="./src/resources/attachments.ts">retrieve</a>(attachmentID) -> AttachmentRetrieveResponse</code>

# Phonenumbers

Types:

- <code><a href="./src/resources/phonenumbers.ts">PhonenumberListResponse</a></code>

Methods:

- <code title="get /v3/phonenumbers">client.phonenumbers.<a href="./src/resources/phonenumbers.ts">list</a>() -> PhonenumberListResponse</code>

# WebhookEvents

Types:

- <code><a href="./src/resources/webhook-events.ts">WebhookEventType</a></code>
- <code><a href="./src/resources/webhook-events.ts">WebhookEventListResponse</a></code>

Methods:

- <code title="get /v3/webhook-events">client.webhookEvents.<a href="./src/resources/webhook-events.ts">list</a>() -> WebhookEventListResponse</code>

# WebhookSubscriptions

Types:

- <code><a href="./src/resources/webhook-subscriptions.ts">WebhookSubscription</a></code>
- <code><a href="./src/resources/webhook-subscriptions.ts">WebhookSubscriptionCreateResponse</a></code>
- <code><a href="./src/resources/webhook-subscriptions.ts">WebhookSubscriptionListResponse</a></code>

Methods:

- <code title="post /v3/webhook-subscriptions">client.webhookSubscriptions.<a href="./src/resources/webhook-subscriptions.ts">create</a>({ ...params }) -> WebhookSubscriptionCreateResponse</code>
- <code title="get /v3/webhook-subscriptions/{subscriptionId}">client.webhookSubscriptions.<a href="./src/resources/webhook-subscriptions.ts">retrieve</a>(subscriptionID) -> WebhookSubscription</code>
- <code title="put /v3/webhook-subscriptions/{subscriptionId}">client.webhookSubscriptions.<a href="./src/resources/webhook-subscriptions.ts">update</a>(subscriptionID, { ...params }) -> WebhookSubscription</code>
- <code title="get /v3/webhook-subscriptions">client.webhookSubscriptions.<a href="./src/resources/webhook-subscriptions.ts">list</a>() -> WebhookSubscriptionListResponse</code>
- <code title="delete /v3/webhook-subscriptions/{subscriptionId}">client.webhookSubscriptions.<a href="./src/resources/webhook-subscriptions.ts">delete</a>(subscriptionID) -> void</code>

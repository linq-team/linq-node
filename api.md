# Shared

Types:

- <code><a href="./src/resources/shared.ts">ChatHandle</a></code>
- <code><a href="./src/resources/shared.ts">MediaPartResponse</a></code>
- <code><a href="./src/resources/shared.ts">Reaction</a></code>
- <code><a href="./src/resources/shared.ts">ReactionType</a></code>
- <code><a href="./src/resources/shared.ts">ServiceType</a></code>
- <code><a href="./src/resources/shared.ts">TextPartResponse</a></code>

# Chats

Types:

- <code><a href="./src/resources/chats/chats.ts">Chat</a></code>
- <code><a href="./src/resources/chats/chats.ts">MediaPart</a></code>
- <code><a href="./src/resources/chats/chats.ts">MessageContent</a></code>
- <code><a href="./src/resources/chats/chats.ts">TextPart</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatCreateResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatUpdateResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatSendVoicememoResponse</a></code>

Methods:

- <code title="post /v3/chats">client.chats.<a href="./src/resources/chats/chats.ts">create</a>({ ...params }) -> ChatCreateResponse</code>
- <code title="get /v3/chats/{chatId}">client.chats.<a href="./src/resources/chats/chats.ts">retrieve</a>(chatID) -> Chat</code>
- <code title="put /v3/chats/{chatId}">client.chats.<a href="./src/resources/chats/chats.ts">update</a>(chatID, { ...params }) -> ChatUpdateResponse</code>
- <code title="get /v3/chats">client.chats.<a href="./src/resources/chats/chats.ts">listChats</a>({ ...params }) -> ChatsListChatsPagination</code>
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
- <code><a href="./src/resources/chats/messages.ts">MessageSendResponse</a></code>

Methods:

- <code title="get /v3/chats/{chatId}/messages">client.chats.messages.<a href="./src/resources/chats/messages.ts">list</a>(chatID, { ...params }) -> MessagesListMessagesPagination</code>
- <code title="post /v3/chats/{chatId}/messages">client.chats.messages.<a href="./src/resources/chats/messages.ts">send</a>(chatID, { ...params }) -> MessageSendResponse</code>

# Messages

Types:

- <code><a href="./src/resources/messages.ts">Message</a></code>
- <code><a href="./src/resources/messages.ts">MessageEffect</a></code>
- <code><a href="./src/resources/messages.ts">ReplyTo</a></code>
- <code><a href="./src/resources/messages.ts">MessageAddReactionResponse</a></code>

Methods:

- <code title="get /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages.ts">retrieve</a>(messageID) -> Message</code>
- <code title="patch /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages.ts">update</a>(messageID, { ...params }) -> Message</code>
- <code title="delete /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages.ts">delete</a>(messageID, { ...params }) -> void</code>
- <code title="post /v3/messages/{messageId}/reactions">client.messages.<a href="./src/resources/messages.ts">addReaction</a>(messageID, { ...params }) -> MessageAddReactionResponse</code>
- <code title="get /v3/messages/{messageId}/thread">client.messages.<a href="./src/resources/messages.ts">listMessagesThread</a>(messageID, { ...params }) -> MessagesListMessagesPagination</code>

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

# PhoneNumbers

Types:

- <code><a href="./src/resources/phone-numbers.ts">PhoneNumberListResponse</a></code>

Methods:

- <code title="get /v3/phone_numbers">client.phoneNumbers.<a href="./src/resources/phone-numbers.ts">list</a>() -> PhoneNumberListResponse</code>

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

# Capability

Types:

- <code><a href="./src/resources/capability.ts">CapabilityCheckiMessageResponse</a></code>
- <code><a href="./src/resources/capability.ts">CapabilityCheckRCSResponse</a></code>

Methods:

- <code title="post /v3/capability/check_imessage">client.capability.<a href="./src/resources/capability.ts">checkiMessage</a>({ ...params }) -> CapabilityCheckiMessageResponse</code>
- <code title="post /v3/capability/check_rcs">client.capability.<a href="./src/resources/capability.ts">checkRCS</a>({ ...params }) -> CapabilityCheckRCSResponse</code>

# Webhooks

Types:

- <code><a href="./src/resources/webhooks.ts">MessageEventV2</a></code>
- <code><a href="./src/resources/webhooks.ts">MessagePayload</a></code>
- <code><a href="./src/resources/webhooks.ts">ReactionEventBase</a></code>
- <code><a href="./src/resources/webhooks.ts">SchemasMediaPartResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">SchemasMessageEffect</a></code>
- <code><a href="./src/resources/webhooks.ts">SchemasTextPartResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageSentV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageReceivedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageReadV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageDeliveredV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageFailedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ReactionAddedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ReactionRemovedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ParticipantAddedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ParticipantRemovedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupNameUpdatedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupIconUpdatedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupNameUpdateFailedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupIconUpdateFailedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatCreatedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatTypingIndicatorStartedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatTypingIndicatorStoppedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageEditedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PhoneNumberStatusUpdatedV2026WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageSentV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageReceivedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageReadV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageDeliveredV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageFailedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ReactionAddedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ReactionRemovedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ParticipantAddedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ParticipantRemovedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupNameUpdatedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupIconUpdatedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupNameUpdateFailedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupIconUpdateFailedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatCreatedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatTypingIndicatorStartedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatTypingIndicatorStoppedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PhoneNumberStatusUpdatedV2025WebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">EventsWebhookEvent</a></code>

Methods:

- <code>client.webhooks.<a href="./src/resources/webhooks.ts">events</a>(body) -> void</code>

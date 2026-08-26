# Shared

Types:

- <code><a href="./src/resources/shared.ts">ChatHandle</a></code>
- <code><a href="./src/resources/shared.ts">LinkPartResponse</a></code>
- <code><a href="./src/resources/shared.ts">MediaPartResponse</a></code>
- <code><a href="./src/resources/shared.ts">Reaction</a></code>
- <code><a href="./src/resources/shared.ts">ReactionType</a></code>
- <code><a href="./src/resources/shared.ts">ServiceType</a></code>
- <code><a href="./src/resources/shared.ts">TextDecoration</a></code>
- <code><a href="./src/resources/shared.ts">TextPartResponse</a></code>

# Chats

Types:

- <code><a href="./src/resources/chats/chats.ts">Chat</a></code>
- <code><a href="./src/resources/chats/chats.ts">LinkPart</a></code>
- <code><a href="./src/resources/chats/chats.ts">MediaPart</a></code>
- <code><a href="./src/resources/chats/chats.ts">MessageContent</a></code>
- <code><a href="./src/resources/chats/chats.ts">TextPart</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatCreateResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatUpdateResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatLeaveChatResponse</a></code>
- <code><a href="./src/resources/chats/chats.ts">ChatSendVoicememoResponse</a></code>

Methods:

- <code title="post /v3/chats">client.chats.<a href="./src/resources/chats/chats.ts">create</a>({ ...params }) -> ChatCreateResponse</code>
- <code title="get /v3/chats/{chatId}">client.chats.<a href="./src/resources/chats/chats.ts">retrieve</a>(chatID) -> Chat</code>
- <code title="put /v3/chats/{chatId}">client.chats.<a href="./src/resources/chats/chats.ts">update</a>(chatID, { ...params }) -> ChatUpdateResponse</code>
- <code title="post /v3/chats/{chatId}/leave">client.chats.<a href="./src/resources/chats/chats.ts">leaveChat</a>(chatID) -> ChatLeaveChatResponse</code>
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

## Location

Types:

- <code><a href="./src/resources/chats/location.ts">GetChatLocationResponse</a></code>
- <code><a href="./src/resources/chats/location.ts">LocationRequestResponse</a></code>

Methods:

- <code title="get /v3/chats/{chatId}/location">client.chats.location.<a href="./src/resources/chats/location.ts">retrieve</a>(chatID) -> GetChatLocationResponse</code>
- <code title="post /v3/chats/{chatId}/location/request">client.chats.location.<a href="./src/resources/chats/location.ts">request</a>(chatID) -> LocationRequestResponse</code>

## Polls

Types:

- <code><a href="./src/resources/chats/polls.ts">Poll</a></code>
- <code><a href="./src/resources/chats/polls.ts">PollEnvelope</a></code>

Methods:

- <code title="post /v3/chats/{chatId}/polls">client.chats.polls.<a href="./src/resources/chats/polls.ts">create</a>(chatID, { ...params }) -> PollEnvelope</code>

## Background

Methods:

- <code title="delete /v3/chats/{chatId}/background">client.chats.background.<a href="./src/resources/chats/background.ts">remove</a>(chatID) -> void</code>
- <code title="post /v3/chats/{chatId}/background">client.chats.background.<a href="./src/resources/chats/background.ts">set</a>(chatID, { ...params }) -> void</code>

# Messages

Types:

- <code><a href="./src/resources/messages/messages.ts">Message</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageEffect</a></code>
- <code><a href="./src/resources/messages/messages.ts">ReplyTo</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageCreateResponse</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageAddReactionResponse</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageUpdateAppCardResponse</a></code>

Methods:

- <code title="post /v3/messages">client.messages.<a href="./src/resources/messages/messages.ts">create</a>({ ...params }) -> MessageCreateResponse</code>
- <code title="get /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages/messages.ts">retrieve</a>(messageID) -> Message</code>
- <code title="patch /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages/messages.ts">update</a>(messageID, { ...params }) -> Message</code>
- <code title="delete /v3/messages/{messageId}">client.messages.<a href="./src/resources/messages/messages.ts">delete</a>(messageID) -> void</code>
- <code title="post /v3/messages/{messageId}/reactions">client.messages.<a href="./src/resources/messages/messages.ts">addReaction</a>(messageID, { ...params }) -> MessageAddReactionResponse</code>
- <code title="get /v3/messages/{messageId}/thread">client.messages.<a href="./src/resources/messages/messages.ts">listMessagesThread</a>(messageID, { ...params }) -> MessagesListMessagesPagination</code>
- <code title="post /v3/messages/{messageId}/update">client.messages.<a href="./src/resources/messages/messages.ts">updateAppCard</a>(messageID, { ...params }) -> MessageUpdateAppCardResponse</code>

## Poll

Methods:

- <code title="get /v3/messages/{messageId}/poll">client.messages.poll.<a href="./src/resources/messages/poll.ts">retrieve</a>(messageID) -> PollEnvelope</code>
- <code title="post /v3/messages/{messageId}/poll/options">client.messages.poll.<a href="./src/resources/messages/poll.ts">addOptions</a>(messageID, { ...params }) -> PollEnvelope</code>
- <code title="post /v3/messages/{messageId}/poll/votes">client.messages.poll.<a href="./src/resources/messages/poll.ts">vote</a>(messageID, { ...params }) -> PollEnvelope</code>

# Attachments

Types:

- <code><a href="./src/resources/attachments.ts">SupportedContentType</a></code>
- <code><a href="./src/resources/attachments.ts">AttachmentCreateResponse</a></code>
- <code><a href="./src/resources/attachments.ts">AttachmentRetrieveResponse</a></code>

Methods:

- <code title="post /v3/attachments">client.attachments.<a href="./src/resources/attachments.ts">create</a>({ ...params }) -> AttachmentCreateResponse</code>
- <code title="get /v3/attachments/{attachmentId}">client.attachments.<a href="./src/resources/attachments.ts">retrieve</a>(attachmentID) -> AttachmentRetrieveResponse</code>
- <code title="delete /v3/attachments/{attachmentId}">client.attachments.<a href="./src/resources/attachments.ts">delete</a>(attachmentID) -> void</code>

# Phonenumbers

Types:

- <code><a href="./src/resources/phonenumbers.ts">PhonenumberListResponse</a></code>

Methods:

- <code title="get /v3/phonenumbers">client.phonenumbers.<a href="./src/resources/phonenumbers.ts">list</a>() -> PhonenumberListResponse</code>

# PhoneNumbers

Types:

- <code><a href="./src/resources/phone-numbers.ts">ReputationActionItem</a></code>
- <code><a href="./src/resources/phone-numbers.ts">ReputationAudit</a></code>
- <code><a href="./src/resources/phone-numbers.ts">ReputationAuditStarted</a></code>
- <code><a href="./src/resources/phone-numbers.ts">ReputationDriver</a></code>
- <code><a href="./src/resources/phone-numbers.ts">ReputationDriverKey</a></code>
- <code><a href="./src/resources/phone-numbers.ts">ReputationEvidence</a></code>
- <code><a href="./src/resources/phone-numbers.ts">ReputationOptOutChat</a></code>
- <code><a href="./src/resources/phone-numbers.ts">ReputationReport</a></code>
- <code><a href="./src/resources/phone-numbers.ts">ReputationUnhealthyChat</a></code>
- <code><a href="./src/resources/phone-numbers.ts">PhoneNumberUpdateResponse</a></code>
- <code><a href="./src/resources/phone-numbers.ts">PhoneNumberListResponse</a></code>

Methods:

- <code title="put /v3/phone_numbers/{phoneNumberId}">client.phoneNumbers.<a href="./src/resources/phone-numbers.ts">update</a>(phoneNumberID, { ...params }) -> PhoneNumberUpdateResponse</code>
- <code title="get /v3/phone_numbers">client.phoneNumbers.<a href="./src/resources/phone-numbers.ts">list</a>() -> PhoneNumberListResponse</code>
- <code title="get /v3/phone_numbers/{phoneNumber}/reputation_audit/{auditId}">client.phoneNumbers.<a href="./src/resources/phone-numbers.ts">getReputationAudit</a>(auditID, { ...params }) -> ReputationAudit</code>
- <code title="post /v3/phone_numbers/{phoneNumber}/reputation_audit">client.phoneNumbers.<a href="./src/resources/phone-numbers.ts">startReputationAudit</a>(phoneNumber) -> ReputationAuditStarted</code>

# AvailableNumber

Types:

- <code><a href="./src/resources/available-number.ts">AvailableNumberRetrieveResponse</a></code>

Methods:

- <code title="get /v3/available_number">client.availableNumber.<a href="./src/resources/available-number.ts">retrieve</a>({ ...params }) -> AvailableNumberRetrieveResponse</code>

# PaymentRequests

Types:

- <code><a href="./src/resources/payment-requests.ts">PaymentRequest</a></code>
- <code><a href="./src/resources/payment-requests.ts">PaymentRequestListResponse</a></code>

Methods:

- <code title="post /v3/payment_requests">client.paymentRequests.<a href="./src/resources/payment-requests.ts">create</a>({ ...params }) -> PaymentRequest</code>
- <code title="get /v3/payment_requests/{paymentRequestId}">client.paymentRequests.<a href="./src/resources/payment-requests.ts">retrieve</a>(paymentRequestID) -> PaymentRequest</code>
- <code title="get /v3/payment_requests">client.paymentRequests.<a href="./src/resources/payment-requests.ts">list</a>({ ...params }) -> PaymentRequestListResponse</code>
- <code title="post /v3/payment_requests/{paymentRequestId}/cancel">client.paymentRequests.<a href="./src/resources/payment-requests.ts">cancel</a>(paymentRequestID) -> PaymentRequest</code>

# PaymentProviders

Types:

- <code><a href="./src/resources/payment-providers.ts">PaymentProvider</a></code>
- <code><a href="./src/resources/payment-providers.ts">PaymentProviderConnectResponse</a></code>

Methods:

- <code title="get /v3/payments/providers/{provider}">client.paymentProviders.<a href="./src/resources/payment-providers.ts">retrieve</a>(provider) -> PaymentProvider</code>
- <code title="post /v3/payments/providers/{provider}/connect">client.paymentProviders.<a href="./src/resources/payment-providers.ts">connect</a>(provider, { ...params }) -> PaymentProviderConnectResponse</code>

# PaymentHandles

Types:

- <code><a href="./src/resources/payment-handles.ts">PaymentHandleConnection</a></code>

Methods:

- <code title="post /v3/payments/handles/{handle}/connect">client.paymentHandles.<a href="./src/resources/payment-handles.ts">connect</a>(handle) -> PaymentHandleConnection</code>
- <code title="get /v3/payments/handles/{handle}/connection">client.paymentHandles.<a href="./src/resources/payment-handles.ts">connection</a>(handle) -> PaymentHandleConnection</code>
- <code title="delete /v3/payments/handles/{handle}/connection">client.paymentHandles.<a href="./src/resources/payment-handles.ts">revoke</a>(handle) -> PaymentHandleConnection</code>
- <code title="post /v3/payments/handles/{handle}/verify">client.paymentHandles.<a href="./src/resources/payment-handles.ts">verify</a>(handle, { ...params }) -> PaymentHandleConnection</code>

# Payments

Types:

- <code><a href="./src/resources/payments.ts">Payment</a></code>
- <code><a href="./src/resources/payments.ts">PaymentCredentialsResponse</a></code>

Methods:

- <code title="post /v3/payments">client.payments.<a href="./src/resources/payments.ts">create</a>({ ...params }) -> Payment</code>
- <code title="get /v3/payments/{paymentId}">client.payments.<a href="./src/resources/payments.ts">retrieve</a>(paymentID) -> Payment</code>
- <code title="post /v3/payments/{paymentId}/cancel">client.payments.<a href="./src/resources/payments.ts">cancel</a>(paymentID) -> Payment</code>
- <code title="get /v3/payments/{paymentId}/credentials">client.payments.<a href="./src/resources/payments.ts">credentials</a>(paymentID) -> PaymentCredentialsResponse</code>

# BlockedHandles

Types:

- <code><a href="./src/resources/blocked-handles.ts">BlockedHandleEntry</a></code>
- <code><a href="./src/resources/blocked-handles.ts">BlockedHandleListResponse</a></code>
- <code><a href="./src/resources/blocked-handles.ts">BlockedHandleBlockResponse</a></code>

Methods:

- <code title="get /v3/blocked_handles">client.blockedHandles.<a href="./src/resources/blocked-handles.ts">list</a>() -> BlockedHandleListResponse</code>
- <code title="post /v3/blocked_handles">client.blockedHandles.<a href="./src/resources/blocked-handles.ts">block</a>({ ...params }) -> BlockedHandleBlockResponse</code>
- <code title="delete /v3/blocked_handles">client.blockedHandles.<a href="./src/resources/blocked-handles.ts">unblock</a>({ ...params }) -> void</code>

# Experiences

Types:

- <code><a href="./src/resources/experiences.ts">ExperienceRetrieveResponse</a></code>
- <code><a href="./src/resources/experiences.ts">ExperienceListResponse</a></code>

Methods:

- <code title="get /v3/experiences/{experience}">client.experiences.<a href="./src/resources/experiences.ts">retrieve</a>(experience) -> ExperienceRetrieveResponse</code>
- <code title="get /v3/experiences">client.experiences.<a href="./src/resources/experiences.ts">list</a>() -> ExperienceListResponse</code>

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

- <code><a href="./src/resources/capability.ts">HandleCheck</a></code>
- <code><a href="./src/resources/capability.ts">HandleCheckResponse</a></code>

Methods:

- <code title="post /v3/capability/check_imessage">client.capability.<a href="./src/resources/capability.ts">checkIMessage</a>({ ...params }) -> HandleCheckResponse</code>
- <code title="post /v3/capability/check_rcs">client.capability.<a href="./src/resources/capability.ts">checkRCS</a>({ ...params }) -> HandleCheckResponse</code>

# Webhooks

Types:

- <code><a href="./src/resources/webhooks.ts">MessageEventV2</a></code>
- <code><a href="./src/resources/webhooks.ts">MessagePayload</a></code>
- <code><a href="./src/resources/webhooks.ts">ReactionEventBase</a></code>
- <code><a href="./src/resources/webhooks.ts">SchemasMediaPartResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">SchemasMessageEffect</a></code>
- <code><a href="./src/resources/webhooks.ts">SchemasTextPartResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageSentWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageReceivedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageReadWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageDeliveredWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageFailedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">MessageEditedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ReactionAddedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ReactionRemovedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PollReceivedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PollSentWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PollDeliveredWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PollReadWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PollUpdatedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PollFailedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PollVoteAddedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PollVoteRemovedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PollReactionAddedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ParticipantAddedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ParticipantRemovedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatCreatedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupNameUpdatedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupIconUpdatedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupNameUpdateFailedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatGroupIconUpdateFailedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatTypingIndicatorStartedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatTypingIndicatorStoppedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatBackgroundUpdatedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">ChatBackgroundUpdateFailedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">PhoneNumberStatusUpdatedWebhookEvent</a></code>
- <code><a href="./src/resources/webhooks.ts">UnwrapWebhookEvent</a></code>

Methods:

- <code>client.webhooks.<a href="./src/resources/webhooks.ts">unwrap</a>(body) -> void</code>

# ContactCard

Types:

- <code><a href="./src/resources/contact-card.ts">SetContactCard</a></code>
- <code><a href="./src/resources/contact-card.ts">ContactCardRetrieveResponse</a></code>

Methods:

- <code title="post /v3/contact_card">client.contactCard.<a href="./src/resources/contact-card.ts">create</a>({ ...params }) -> SetContactCard</code>
- <code title="get /v3/contact_card">client.contactCard.<a href="./src/resources/contact-card.ts">retrieve</a>({ ...params }) -> ContactCardRetrieveResponse</code>
- <code title="patch /v3/contact_card">client.contactCard.<a href="./src/resources/contact-card.ts">update</a>({ ...params }) -> SetContactCard</code>

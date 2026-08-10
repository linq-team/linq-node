// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { McpOptions } from './options';

export type SdkMethod = {
  clientCallName: string;
  fullyQualifiedName: string;
  httpMethod?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'query';
  httpPath?: string;
};

export const sdkMethods: SdkMethod[] = [
  {
    clientCallName: 'client.chats.create',
    fullyQualifiedName: 'chats.create',
    httpMethod: 'post',
    httpPath: '/v3/chats',
  },
  {
    clientCallName: 'client.chats.retrieve',
    fullyQualifiedName: 'chats.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/chats/{chatId}',
  },
  {
    clientCallName: 'client.chats.update',
    fullyQualifiedName: 'chats.update',
    httpMethod: 'put',
    httpPath: '/v3/chats/{chatId}',
  },
  {
    clientCallName: 'client.chats.leaveChat',
    fullyQualifiedName: 'chats.leaveChat',
    httpMethod: 'post',
    httpPath: '/v3/chats/{chatId}/leave',
  },
  {
    clientCallName: 'client.chats.listChats',
    fullyQualifiedName: 'chats.listChats',
    httpMethod: 'get',
    httpPath: '/v3/chats',
  },
  {
    clientCallName: 'client.chats.markAsRead',
    fullyQualifiedName: 'chats.markAsRead',
    httpMethod: 'post',
    httpPath: '/v3/chats/{chatId}/read',
  },
  {
    clientCallName: 'client.chats.sendVoicememo',
    fullyQualifiedName: 'chats.sendVoicememo',
    httpMethod: 'post',
    httpPath: '/v3/chats/{chatId}/voicememo',
  },
  {
    clientCallName: 'client.chats.shareContactCard',
    fullyQualifiedName: 'chats.shareContactCard',
    httpMethod: 'post',
    httpPath: '/v3/chats/{chatId}/share_contact_card',
  },
  {
    clientCallName: 'client.chats.participants.add',
    fullyQualifiedName: 'chats.participants.add',
    httpMethod: 'post',
    httpPath: '/v3/chats/{chatId}/participants',
  },
  {
    clientCallName: 'client.chats.participants.remove',
    fullyQualifiedName: 'chats.participants.remove',
    httpMethod: 'delete',
    httpPath: '/v3/chats/{chatId}/participants',
  },
  {
    clientCallName: 'client.chats.typing.start',
    fullyQualifiedName: 'chats.typing.start',
    httpMethod: 'post',
    httpPath: '/v3/chats/{chatId}/typing',
  },
  {
    clientCallName: 'client.chats.typing.stop',
    fullyQualifiedName: 'chats.typing.stop',
    httpMethod: 'delete',
    httpPath: '/v3/chats/{chatId}/typing',
  },
  {
    clientCallName: 'client.chats.messages.list',
    fullyQualifiedName: 'chats.messages.list',
    httpMethod: 'get',
    httpPath: '/v3/chats/{chatId}/messages',
  },
  {
    clientCallName: 'client.chats.messages.send',
    fullyQualifiedName: 'chats.messages.send',
    httpMethod: 'post',
    httpPath: '/v3/chats/{chatId}/messages',
  },
  {
    clientCallName: 'client.chats.location.retrieve',
    fullyQualifiedName: 'chats.location.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/chats/{chatId}/location',
  },
  {
    clientCallName: 'client.chats.location.request',
    fullyQualifiedName: 'chats.location.request',
    httpMethod: 'post',
    httpPath: '/v3/chats/{chatId}/location/request',
  },
  {
    clientCallName: 'client.chats.polls.create',
    fullyQualifiedName: 'chats.polls.create',
    httpMethod: 'post',
    httpPath: '/v3/chats/{chatId}/polls',
  },
  {
    clientCallName: 'client.messages.create',
    fullyQualifiedName: 'messages.create',
    httpMethod: 'post',
    httpPath: '/v3/messages',
  },
  {
    clientCallName: 'client.messages.retrieve',
    fullyQualifiedName: 'messages.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/messages/{messageId}',
  },
  {
    clientCallName: 'client.messages.update',
    fullyQualifiedName: 'messages.update',
    httpMethod: 'patch',
    httpPath: '/v3/messages/{messageId}',
  },
  {
    clientCallName: 'client.messages.delete',
    fullyQualifiedName: 'messages.delete',
    httpMethod: 'delete',
    httpPath: '/v3/messages/{messageId}',
  },
  {
    clientCallName: 'client.messages.addReaction',
    fullyQualifiedName: 'messages.addReaction',
    httpMethod: 'post',
    httpPath: '/v3/messages/{messageId}/reactions',
  },
  {
    clientCallName: 'client.messages.listMessagesThread',
    fullyQualifiedName: 'messages.listMessagesThread',
    httpMethod: 'get',
    httpPath: '/v3/messages/{messageId}/thread',
  },
  {
    clientCallName: 'client.messages.updateAppCard',
    fullyQualifiedName: 'messages.updateAppCard',
    httpMethod: 'post',
    httpPath: '/v3/messages/{messageId}/update',
  },
  {
    clientCallName: 'client.messages.poll.retrieve',
    fullyQualifiedName: 'messages.poll.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/messages/{messageId}/poll',
  },
  {
    clientCallName: 'client.messages.poll.addOptions',
    fullyQualifiedName: 'messages.poll.addOptions',
    httpMethod: 'post',
    httpPath: '/v3/messages/{messageId}/poll/options',
  },
  {
    clientCallName: 'client.messages.poll.vote',
    fullyQualifiedName: 'messages.poll.vote',
    httpMethod: 'post',
    httpPath: '/v3/messages/{messageId}/poll/votes',
  },
  {
    clientCallName: 'client.attachments.create',
    fullyQualifiedName: 'attachments.create',
    httpMethod: 'post',
    httpPath: '/v3/attachments',
  },
  {
    clientCallName: 'client.attachments.retrieve',
    fullyQualifiedName: 'attachments.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/attachments/{attachmentId}',
  },
  {
    clientCallName: 'client.attachments.delete',
    fullyQualifiedName: 'attachments.delete',
    httpMethod: 'delete',
    httpPath: '/v3/attachments/{attachmentId}',
  },
  {
    clientCallName: 'client.phonenumbers.list',
    fullyQualifiedName: 'phonenumbers.list',
    httpMethod: 'get',
    httpPath: '/v3/phonenumbers',
  },
  {
    clientCallName: 'client.phoneNumbers.update',
    fullyQualifiedName: 'phoneNumbers.update',
    httpMethod: 'put',
    httpPath: '/v3/phone_numbers/{phoneNumberId}',
  },
  {
    clientCallName: 'client.phoneNumbers.list',
    fullyQualifiedName: 'phoneNumbers.list',
    httpMethod: 'get',
    httpPath: '/v3/phone_numbers',
  },
  {
    clientCallName: 'client.availableNumber.retrieve',
    fullyQualifiedName: 'availableNumber.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/available_number',
  },
  {
    clientCallName: 'client.paymentRequests.create',
    fullyQualifiedName: 'paymentRequests.create',
    httpMethod: 'post',
    httpPath: '/v3/payment_requests',
  },
  {
    clientCallName: 'client.paymentRequests.retrieve',
    fullyQualifiedName: 'paymentRequests.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/payment_requests/{paymentRequestId}',
  },
  {
    clientCallName: 'client.paymentRequests.list',
    fullyQualifiedName: 'paymentRequests.list',
    httpMethod: 'get',
    httpPath: '/v3/payment_requests',
  },
  {
    clientCallName: 'client.paymentRequests.cancel',
    fullyQualifiedName: 'paymentRequests.cancel',
    httpMethod: 'post',
    httpPath: '/v3/payment_requests/{paymentRequestId}/cancel',
  },
  {
    clientCallName: 'client.paymentProviders.retrieve',
    fullyQualifiedName: 'paymentProviders.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/payments/providers/{provider}',
  },
  {
    clientCallName: 'client.paymentProviders.connect',
    fullyQualifiedName: 'paymentProviders.connect',
    httpMethod: 'post',
    httpPath: '/v3/payments/providers/{provider}/connect',
  },
  {
    clientCallName: 'client.paymentHandles.connect',
    fullyQualifiedName: 'paymentHandles.connect',
    httpMethod: 'post',
    httpPath: '/v3/payments/handles/{handle}/connect',
  },
  {
    clientCallName: 'client.paymentHandles.connection',
    fullyQualifiedName: 'paymentHandles.connection',
    httpMethod: 'get',
    httpPath: '/v3/payments/handles/{handle}/connection',
  },
  {
    clientCallName: 'client.paymentHandles.revoke',
    fullyQualifiedName: 'paymentHandles.revoke',
    httpMethod: 'delete',
    httpPath: '/v3/payments/handles/{handle}/connection',
  },
  {
    clientCallName: 'client.paymentHandles.verify',
    fullyQualifiedName: 'paymentHandles.verify',
    httpMethod: 'post',
    httpPath: '/v3/payments/handles/{handle}/verify',
  },
  {
    clientCallName: 'client.payments.create',
    fullyQualifiedName: 'payments.create',
    httpMethod: 'post',
    httpPath: '/v3/payments',
  },
  {
    clientCallName: 'client.payments.retrieve',
    fullyQualifiedName: 'payments.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/payments/{paymentId}',
  },
  {
    clientCallName: 'client.payments.cancel',
    fullyQualifiedName: 'payments.cancel',
    httpMethod: 'post',
    httpPath: '/v3/payments/{paymentId}/cancel',
  },
  {
    clientCallName: 'client.payments.credentials',
    fullyQualifiedName: 'payments.credentials',
    httpMethod: 'get',
    httpPath: '/v3/payments/{paymentId}/credentials',
  },
  {
    clientCallName: 'client.experiences.retrieve',
    fullyQualifiedName: 'experiences.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/experiences/{experience}',
  },
  {
    clientCallName: 'client.experiences.list',
    fullyQualifiedName: 'experiences.list',
    httpMethod: 'get',
    httpPath: '/v3/experiences',
  },
  {
    clientCallName: 'client.webhookEvents.list',
    fullyQualifiedName: 'webhookEvents.list',
    httpMethod: 'get',
    httpPath: '/v3/webhook-events',
  },
  {
    clientCallName: 'client.webhookSubscriptions.create',
    fullyQualifiedName: 'webhookSubscriptions.create',
    httpMethod: 'post',
    httpPath: '/v3/webhook-subscriptions',
  },
  {
    clientCallName: 'client.webhookSubscriptions.retrieve',
    fullyQualifiedName: 'webhookSubscriptions.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/webhook-subscriptions/{subscriptionId}',
  },
  {
    clientCallName: 'client.webhookSubscriptions.update',
    fullyQualifiedName: 'webhookSubscriptions.update',
    httpMethod: 'put',
    httpPath: '/v3/webhook-subscriptions/{subscriptionId}',
  },
  {
    clientCallName: 'client.webhookSubscriptions.list',
    fullyQualifiedName: 'webhookSubscriptions.list',
    httpMethod: 'get',
    httpPath: '/v3/webhook-subscriptions',
  },
  {
    clientCallName: 'client.webhookSubscriptions.delete',
    fullyQualifiedName: 'webhookSubscriptions.delete',
    httpMethod: 'delete',
    httpPath: '/v3/webhook-subscriptions/{subscriptionId}',
  },
  {
    clientCallName: 'client.capability.checkIMessage',
    fullyQualifiedName: 'capability.checkIMessage',
    httpMethod: 'post',
    httpPath: '/v3/capability/check_imessage',
  },
  {
    clientCallName: 'client.capability.checkRCS',
    fullyQualifiedName: 'capability.checkRCS',
    httpMethod: 'post',
    httpPath: '/v3/capability/check_rcs',
  },
  { clientCallName: 'client.webhooks.unwrap', fullyQualifiedName: 'webhooks.unwrap' },
  {
    clientCallName: 'client.contactCard.create',
    fullyQualifiedName: 'contactCard.create',
    httpMethod: 'post',
    httpPath: '/v3/contact_card',
  },
  {
    clientCallName: 'client.contactCard.retrieve',
    fullyQualifiedName: 'contactCard.retrieve',
    httpMethod: 'get',
    httpPath: '/v3/contact_card',
  },
  {
    clientCallName: 'client.contactCard.update',
    fullyQualifiedName: 'contactCard.update',
    httpMethod: 'patch',
    httpPath: '/v3/contact_card',
  },
];

function allowedMethodsForCodeTool(options: McpOptions | undefined): SdkMethod[] | undefined {
  if (!options) {
    return undefined;
  }

  let allowedMethods: SdkMethod[];

  if (options.codeAllowHttpGets || options.codeAllowedMethods) {
    // Start with nothing allowed and then add into it from options
    let allowedMethodsSet = new Set<SdkMethod>();

    if (options.codeAllowHttpGets) {
      // Add all methods that map to an HTTP GET
      sdkMethods
        .filter((method) => method.httpMethod === 'get')
        .forEach((method) => allowedMethodsSet.add(method));
    }

    if (options.codeAllowedMethods) {
      // Add all methods that match any of the allowed regexps
      const allowedRegexps = options.codeAllowedMethods.map((pattern) => {
        try {
          return new RegExp(pattern);
        } catch (e) {
          throw new Error(
            `Invalid regex pattern for allowed method: "${pattern}": ${e instanceof Error ? e.message : e}`,
          );
        }
      });

      sdkMethods
        .filter((method) => allowedRegexps.some((regexp) => regexp.test(method.fullyQualifiedName)))
        .forEach((method) => allowedMethodsSet.add(method));
    }

    allowedMethods = Array.from(allowedMethodsSet);
  } else {
    // Start with everything allowed
    allowedMethods = [...sdkMethods];
  }

  if (options.codeBlockedMethods) {
    // Filter down based on blocked regexps
    const blockedRegexps = options.codeBlockedMethods.map((pattern) => {
      try {
        return new RegExp(pattern);
      } catch (e) {
        throw new Error(
          `Invalid regex pattern for blocked method: "${pattern}": ${e instanceof Error ? e.message : e}`,
        );
      }
    });

    allowedMethods = allowedMethods.filter(
      (method) => !blockedRegexps.some((regexp) => regexp.test(method.fullyQualifiedName)),
    );
  }

  return allowedMethods;
}

export function blockedMethodsForCodeTool(options: McpOptions | undefined): SdkMethod[] | undefined {
  const allowedMethods = allowedMethodsForCodeTool(options);
  if (!allowedMethods) {
    return undefined;
  }

  const allowedSet = new Set(allowedMethods.map((method) => method.fullyQualifiedName));

  // Return any methods that are not explicitly allowed
  return sdkMethods.filter((method) => !allowedSet.has(method.fullyQualifiedName));
}

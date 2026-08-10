// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import MiniSearch from 'minisearch';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { getLogger } from './logger';

type PerLanguageData = {
  method?: string;
  example?: string;
};

type MethodEntry = {
  name: string;
  endpoint: string;
  httpMethod: string;
  summary: string;
  description: string;
  stainlessPath: string;
  qualified: string;
  params?: string[];
  response?: string;
  markdown?: string;
  perLanguage?: Record<string, PerLanguageData>;
};

type ProseChunk = {
  content: string;
  tag: string;
  sectionContext?: string;
  source?: string;
};

type MiniSearchDocument = {
  id: string;
  kind: 'http_method' | 'prose';
  name?: string;
  endpoint?: string;
  summary?: string;
  description?: string;
  qualified?: string;
  stainlessPath?: string;
  content?: string;
  sectionContext?: string;
  _original: Record<string, unknown>;
};

type SearchResult = {
  results: (string | Record<string, unknown>)[];
};

const EMBEDDED_METHODS: MethodEntry[] = [
  {
    name: 'create',
    endpoint: '/v3/chats',
    httpMethod: 'post',
    summary: 'Create a new chat',
    description:
      'Create a new chat with specified participants and send an initial message.\nThe initial message is required when creating a chat.\n\n## Message Effects\n\nYou can add iMessage effects to make your messages more expressive. Effects are\noptional and can be either screen effects (full-screen animations) or bubble effects\n(message bubble animations).\n\n**Screen Effects:** `confetti`, `fireworks`, `lasers`, `sparkles`, `celebration`,\n`hearts`, `love`, `balloons`, `happy_birthday`, `echo`, `spotlight`\n\n**Bubble Effects:** `slam`, `loud`, `gentle`, `invisible`\n\nOnly one effect type can be applied per message.\n\n## Inline Text Decorations (iMessage only)\n\nUse the `text_decorations` array on a text part to apply styling and animations to character ranges.\n\nEach decoration specifies a `range: [start, end)` and exactly one of `style` or `animation`.\n\n**Styles:** `bold`, `italic`, `strikethrough`, `underline`\n**Animations:** `big`, `small`, `shake`, `nod`, `explode`, `ripple`, `bloom`, `jitter`\n\n```json\n{\n  "type": "text",\n  "value": "Hello world",\n  "text_decorations": [\n    { "range": [0, 5], "style": "bold" },\n    { "range": [6, 11], "animation": "shake" }\n  ]\n}\n```\n\n**Note:** Style ranges (bold, italic, etc.) may overlap, but animation ranges must not overlap with other animations or styles. Text decorations only render for iMessage recipients.\nFor SMS/RCS, text decorations are not applied.\n\n## First-Message Link Restriction\n\nTo protect sender deliverability, the **first outbound message** of a new chat cannot be a link.\nThe request is rejected with `400` (error code `1005`) when:\n\n- The message contains a `link` part (explicit rich-preview link), or\n- Any `text` part contains a URL.\n\nThis rule applies only to `POST /v3/chats`. Follow-up messages on an existing chat\n(`POST /v3/chats/{chatId}/messages`) are not subject to this restriction.\n\n## Reusing an Existing Chat\n\nChats are keyed on the `from` line plus the exact set of `to` handles. Repeating this\nrequest with the same `from` and `to` returns the **existing** chat and sends the message\ninto it instead of starting a second conversation.\n\nA group chat that has a `display_name` is excluded from that matching. To run several\nparallel groups over the same participants, name each one with `PUT /v3/chats/{chatId}`\nbefore creating the next: the following `POST /v3/chats` with the same `to` then returns a\nnew, separate `chat_id`. Two other cases also produce a new chat instead of reusing one —\nthe participant set changed (a participant was added or removed), or the `from` line left\nthe group.\n\nWhenever the response is a new chat, the first-message rules above apply to that request:\nno link in the first message, and no `reply_to` or message effect. To send into a chat you\nalready know, use `POST /v3/chats/{chatId}/messages` with its `chat_id`.\n',
    stainlessPath: '(resource) chats > (method) create',
    qualified: 'client.chats.create',
    params: [
      'from: string;',
      "message: { action?: { action: string; experience: string; params?: object; }; effect?: { name?: string; type?: 'screen' | 'bubble'; }; idempotency_key?: string; parts?: { type: 'text'; value: string; mention?: string; mention_range?: number[]; text_decorations?: text_decoration[]; } | { type: 'media'; attachment_id?: string; url?: string; } | { type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; type: 'imessage_app'; fallback_text?: string; interactive?: boolean; url?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: { message_id: string; part_index?: number; }; };",
      'to: string[];',
      'override_optout?: boolean;',
    ],
    response:
      "{ chat: { id: string; display_name: string; handles: object[]; health_status: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT'; updated_at: string; }; is_group: boolean; message: object; service: 'iMessage' | 'SMS' | 'RCS'; }; }",
    markdown:
      "## create\n\n`client.chats.create(from: string, message: { action?: object; effect?: message_effect; idempotency_key?: string; parts?: text_part | media_part | link_part | object[]; preferred_service?: service_type; reply_to?: reply_to; }, to: string[], override_optout?: boolean): { chat: object; }`\n\n**post** `/v3/chats`\n\nCreate a new chat with specified participants and send an initial message.\nThe initial message is required when creating a chat.\n\n## Message Effects\n\nYou can add iMessage effects to make your messages more expressive. Effects are\noptional and can be either screen effects (full-screen animations) or bubble effects\n(message bubble animations).\n\n**Screen Effects:** `confetti`, `fireworks`, `lasers`, `sparkles`, `celebration`,\n`hearts`, `love`, `balloons`, `happy_birthday`, `echo`, `spotlight`\n\n**Bubble Effects:** `slam`, `loud`, `gentle`, `invisible`\n\nOnly one effect type can be applied per message.\n\n## Inline Text Decorations (iMessage only)\n\nUse the `text_decorations` array on a text part to apply styling and animations to character ranges.\n\nEach decoration specifies a `range: [start, end)` and exactly one of `style` or `animation`.\n\n**Styles:** `bold`, `italic`, `strikethrough`, `underline`\n**Animations:** `big`, `small`, `shake`, `nod`, `explode`, `ripple`, `bloom`, `jitter`\n\n```json\n{\n  \"type\": \"text\",\n  \"value\": \"Hello world\",\n  \"text_decorations\": [\n    { \"range\": [0, 5], \"style\": \"bold\" },\n    { \"range\": [6, 11], \"animation\": \"shake\" }\n  ]\n}\n```\n\n**Note:** Style ranges (bold, italic, etc.) may overlap, but animation ranges must not overlap with other animations or styles. Text decorations only render for iMessage recipients.\nFor SMS/RCS, text decorations are not applied.\n\n## First-Message Link Restriction\n\nTo protect sender deliverability, the **first outbound message** of a new chat cannot be a link.\nThe request is rejected with `400` (error code `1005`) when:\n\n- The message contains a `link` part (explicit rich-preview link), or\n- Any `text` part contains a URL.\n\nThis rule applies only to `POST /v3/chats`. Follow-up messages on an existing chat\n(`POST /v3/chats/{chatId}/messages`) are not subject to this restriction.\n\n## Reusing an Existing Chat\n\nChats are keyed on the `from` line plus the exact set of `to` handles. Repeating this\nrequest with the same `from` and `to` returns the **existing** chat and sends the message\ninto it instead of starting a second conversation.\n\nA group chat that has a `display_name` is excluded from that matching. To run several\nparallel groups over the same participants, name each one with `PUT /v3/chats/{chatId}`\nbefore creating the next: the following `POST /v3/chats` with the same `to` then returns a\nnew, separate `chat_id`. Two other cases also produce a new chat instead of reusing one —\nthe participant set changed (a participant was added or removed), or the `from` line left\nthe group.\n\nWhenever the response is a new chat, the first-message rules above apply to that request:\nno link in the first message, and no `reply_to` or message effect. To send into a chat you\nalready know, use `POST /v3/chats/{chatId}/messages` with its `chat_id`.\n\n\n### Parameters\n\n- `from: string`\n  Sender phone number in E.164 format. Must be a phone number that the\nauthenticated partner has permission to send from.\n\n\n- `message: { action?: { action: string; experience: string; params?: object; }; effect?: { name?: string; type?: 'screen' | 'bubble'; }; idempotency_key?: string; parts?: { type: 'text'; value: string; mention?: string; mention_range?: number[]; text_decorations?: text_decoration[]; } | { type: 'media'; attachment_id?: string; url?: string; } | { type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; type: 'imessage_app'; fallback_text?: string; interactive?: boolean; url?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: { message_id: string; part_index?: number; }; }`\n  Message content container. Groups all message-related fields together,\nseparating the \"what\" (message content) from the \"where\" (routing fields like from/to).\n\nA message carries EITHER `parts` — text and attachments, which compose\ninto one bubble — or a single `action`, which invokes an experience\ninside Linq's iMessage app. Never both: an app card is the whole message\n(Apple's `MSMessage` cannot coexist with text), so copy and a card are\ntwo sends, not one.\n\n  - `action?: { action: string; experience: string; params?: object; }`\n    Invokes an action on an experience — a third party that renders inside\nLinq's iMessage app. Linq resolves the recipient's connection, mints any\nsession the action needs, composes the card and sends it; none of that\nis visible to you.\n\nCall `GET /v3/experiences/{experience}` for the actions you may invoke\nand the fields each accepts.\n\n  - `effect?: { name?: string; type?: 'screen' | 'bubble'; }`\n    iMessage effect to apply to this message (screen or bubble effect)\n  - `idempotency_key?: string`\n    Optional idempotency key for this message.\nUse this to prevent duplicate sends of the same message. Reusing a key\nwhose message was deleted — or was an ephemeral message that has since\nexpired — returns 404; the message is never resent.\n\n  - `parts?: { type: 'text'; value: string; mention?: string; mention_range?: number[]; text_decorations?: { range: number[]; animation?: 'big' | 'small' | 'shake' | 'nod' | 'explode' | 'ripple' | 'bloom' | 'jitter'; style?: 'bold' | 'italic' | 'strikethrough' | 'underline'; }[]; } | { type: 'media'; attachment_id?: string; url?: string; } | { type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; type: 'imessage_app'; fallback_text?: string; interactive?: boolean; url?: string; }[]`\n    Array of message parts. Each part can be text, media, or link.\nParts are displayed in order. Text and media can be mixed freely,\nbut a `link` part must be the only part in the message.\n\n**Rich Link Previews:**\n- Use a `link` part to send a URL with a rich preview card\n- A `link` part must be the **only** part in the message\n- To send a URL as plain text (no preview), use a `text` part instead\n\n**Supported Media:**\n- Images: .jpg, .jpeg, .png, .gif, .heic, .heif, .tif, .tiff, .bmp\n- Videos: .mp4, .mov, .m4v, .mpeg, .mpg, .3gp\n- Audio: .m4a, .mp3, .aac, .caf, .wav, .aiff, .amr\n- Documents: .pdf, .txt, .rtf, .csv, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pages, .numbers, .key, .epub, .zip, .html, .htm\n- Contact & Calendar: .vcf, .ics\n\n**Audio:**\n- Audio files (.m4a, .mp3, .aac, .caf, .wav, .aiff, .amr) are fully supported as media parts\n- To send audio as an **iMessage voice memo bubble** (inline playback UI), use the dedicated\n  `/v3/chats/{chatId}/voicememo` endpoint instead\n\n**Validation Rules:**\n- A `link` part must be the **only** part in the message. It cannot be combined\n  with text or media parts.\n- Consecutive text parts are not allowed. Text parts must be separated by\n  media parts. For example, [text, text] is invalid, but [text, media, text] is valid.\n- Maximum of **100 parts** total.\n- Media parts using a public `url` (downloaded by the server on send) are\n  capped at **40**. Parts using `attachment_id` or presigned URLs\n  are exempt from this sub-limit. For bulk media sends exceeding 40 files,\n  pre-upload via `POST /v3/attachments` and reference by `attachment_id` or `download_url`.\n\n  - `preferred_service?: 'iMessage' | 'SMS' | 'RCS'`\n    Messaging service type\n  - `reply_to?: { message_id: string; part_index?: number; }`\n    Reply to another message to create a threaded conversation\n\n- `to: string[]`\n  Array of recipient handles (phone numbers in E.164 format or email addresses).\nFor individual chats, provide one recipient. For group chats, provide multiple.\n\n\n- `override_optout?: boolean`\n  Send even though the recipient asked you to stop (`403`, error code\n`2024`). Applies to this request only: the opt-out stays in place, so\nthe next send without this flag is rejected again. Every override is\nrecorded against your API key.\n\n\n### Returns\n\n- `{ chat: { id: string; display_name: string; handles: object[]; health_status: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT'; updated_at: string; }; is_group: boolean; message: object; service: 'iMessage' | 'SMS' | 'RCS'; }; }`\n  Response for creating a new chat with an initial message\n\n  - `chat: { id: string; display_name: string; handles: { id: string; handle: string; joined_at: string; service: 'iMessage' | 'SMS' | 'RCS'; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]; health_status: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT'; updated_at: string; }; is_group: boolean; message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: object | object | object | { app: object; layout: object; reactions: reaction[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; sent_at: string; delivered_at?: string; effect?: object; from_handle?: object; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: object; service?: 'iMessage' | 'SMS' | 'RCS'; }; service: 'iMessage' | 'SMS' | 'RCS'; }`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst chat = await client.chats.create({\n  from: '+12052535597',\n  message: {},\n  to: ['+12052532136'],\n});\n\nconsole.log(chat);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.New',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tchat, err := client.Chats.New(context.TODO(), linqgo.ChatNewParams{\n\t\tFrom: "+12052535597",\n\t\tMessage: linqgo.MessageContentParam{\n\t\t\tParts: []linqgo.MessageContentPartUnionParam{{\n\t\t\t\tOfText: &linqgo.TextPartParam{\n\t\t\t\t\tType:  linqgo.TextPartTypeText,\n\t\t\t\t\tValue: "Hello! How can I help you today?",\n\t\t\t\t},\n\t\t\t}},\n\t\t},\n\t\tTo: []string{"+12052532136"},\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", chat.Chat)\n}\n',
      },
      python: {
        method: 'chats.create',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nchat = client.chats.create(\n    from_="+12052535597",\n    message={\n        "parts": [{\n            "type": "text",\n            "value": "Hello! How can I help you today?",\n        }]\n    },\n    to=["+12052532136"],\n)\nprint(chat.chat)',
      },
      typescript: {
        method: 'client.chats.create',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst chat = await client.chats.create({\n  from: '+12052535597',\n  message: { parts: [{ type: 'text', value: 'Hello! How can I help you today?' }] },\n  to: ['+12052532136'],\n});\n\nconsole.log(chat.chat);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "from": "+12052535597",\n          "message": {\n            "parts": [\n              {\n                "type": "text",\n                "value": "Hello! How can I help you today?"\n              }\n            ]\n          },\n          "to": [\n            "+12052532136"\n          ],\n          "override_optout": false\n        }\'',
      },
    },
  },
  {
    name: 'list_chats',
    endpoint: '/v3/chats',
    httpMethod: 'get',
    summary: 'List all chats',
    description:
      'Retrieves a paginated list of chats for the authenticated partner.\n\n**Filtering:**\n- If `from` is provided, returns chats for that specific phone number\n- If `from` is omitted, returns chats across all phone numbers owned by the partner\n- If `to` is provided, only returns chats where the specified handle is a participant\n\n**Pagination:**\n- Use `limit` to control page size (default: 20, max: 100)\n- The response includes `next_cursor` for fetching the next page\n- When `next_cursor` is `null`, there are no more results to fetch\n- Pass the `next_cursor` value as the `cursor` parameter for the next request\n\n**Example pagination flow:**\n1. First request: `GET /v3/chats?from=%2B12223334444&limit=20`\n2. Response includes `next_cursor: "20"` (more results exist)\n3. Next request: `GET /v3/chats?from=%2B12223334444&limit=20&cursor=20`\n4. Response includes `next_cursor: null` (no more results)\n',
    stainlessPath: '(resource) chats > (method) list_chats',
    qualified: 'client.chats.listChats',
    params: ['cursor?: string;', 'from?: string;', 'limit?: number;', 'to?: string;'],
    response:
      "{ id: string; created_at: string; display_name: string; handles: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]; health_status: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT'; updated_at: string; }; is_archived: boolean; is_group: boolean; updated_at: string; group_chat_icon?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }",
    markdown:
      "## list_chats\n\n`client.chats.listChats(cursor?: string, from?: string, limit?: number, to?: string): { id: string; created_at: string; display_name: string; handles: chat_handle[]; health_status: object; is_archived: boolean; is_group: boolean; updated_at: string; group_chat_icon?: string; service?: service_type; }`\n\n**get** `/v3/chats`\n\nRetrieves a paginated list of chats for the authenticated partner.\n\n**Filtering:**\n- If `from` is provided, returns chats for that specific phone number\n- If `from` is omitted, returns chats across all phone numbers owned by the partner\n- If `to` is provided, only returns chats where the specified handle is a participant\n\n**Pagination:**\n- Use `limit` to control page size (default: 20, max: 100)\n- The response includes `next_cursor` for fetching the next page\n- When `next_cursor` is `null`, there are no more results to fetch\n- Pass the `next_cursor` value as the `cursor` parameter for the next request\n\n**Example pagination flow:**\n1. First request: `GET /v3/chats?from=%2B12223334444&limit=20`\n2. Response includes `next_cursor: \"20\"` (more results exist)\n3. Next request: `GET /v3/chats?from=%2B12223334444&limit=20&cursor=20`\n4. Response includes `next_cursor: null` (no more results)\n\n\n### Parameters\n\n- `cursor?: string`\n  Pagination cursor from the previous response's `next_cursor` field.\nOmit this parameter for the first page of results.\n\n\n- `from?: string`\n  Phone number to filter chats by. Returns chats made from this phone number.\nMust be in E.164 format (e.g., `+13343284472`). The `+` is automatically URL-encoded by HTTP clients.\nIf omitted, returns chats across all phone numbers owned by the partner.\n\n\n- `limit?: number`\n  Maximum number of chats to return per page\n\n- `to?: string`\n  Filter chats by a participant handle. Only returns chats where this handle is a participant.\nCan be an E.164 phone number (e.g., `+13343284472`) or an email address (e.g., `user@example.com`).\nFor phone numbers, the `+` is automatically URL-encoded by HTTP clients.\n\n\n### Returns\n\n- `{ id: string; created_at: string; display_name: string; handles: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]; health_status: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT'; updated_at: string; }; is_archived: boolean; is_group: boolean; updated_at: string; group_chat_icon?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n\n  - `id: string`\n  - `created_at: string`\n  - `display_name: string`\n  - `handles: { id: string; handle: string; joined_at: string; service: 'iMessage' | 'SMS' | 'RCS'; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]`\n  - `health_status: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT'; updated_at: string; }`\n  - `is_archived: boolean`\n  - `is_group: boolean`\n  - `updated_at: string`\n  - `group_chat_icon?: string`\n  - `service?: 'iMessage' | 'SMS' | 'RCS'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\n// Automatically fetches more pages as needed.\nfor await (const chat of client.chats.listChats()) {\n  console.log(chat);\n}\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.ListChats',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpage, err := client.Chats.ListChats(context.TODO(), linqgo.ChatListChatsParams{})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", page)\n}\n',
      },
      python: {
        method: 'chats.list_chats',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npage = client.chats.list_chats()\npage = page.chats[0]\nprint(page.id)',
      },
      typescript: {
        method: 'client.chats.listChats',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\n// Automatically fetches more pages as needed.\nfor await (const chat of client.chats.listChats()) {\n  console.log(chat.id);\n}",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/chats/{chatId}',
    httpMethod: 'get',
    summary: 'Get a chat by ID',
    description: 'Retrieve a chat by its unique identifier.',
    stainlessPath: '(resource) chats > (method) retrieve',
    qualified: 'client.chats.retrieve',
    params: ['chatId: string;'],
    response:
      "{ id: string; created_at: string; display_name: string; handles: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]; health_status: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT'; updated_at: string; }; is_archived: boolean; is_group: boolean; updated_at: string; group_chat_icon?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }",
    markdown:
      "## retrieve\n\n`client.chats.retrieve(chatId: string): { id: string; created_at: string; display_name: string; handles: chat_handle[]; health_status: object; is_archived: boolean; is_group: boolean; updated_at: string; group_chat_icon?: string; service?: service_type; }`\n\n**get** `/v3/chats/{chatId}`\n\nRetrieve a chat by its unique identifier.\n\n### Parameters\n\n- `chatId: string`\n\n### Returns\n\n- `{ id: string; created_at: string; display_name: string; handles: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]; health_status: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT'; updated_at: string; }; is_archived: boolean; is_group: boolean; updated_at: string; group_chat_icon?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n\n  - `id: string`\n  - `created_at: string`\n  - `display_name: string`\n  - `handles: { id: string; handle: string; joined_at: string; service: 'iMessage' | 'SMS' | 'RCS'; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]`\n  - `health_status: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT'; updated_at: string; }`\n  - `is_archived: boolean`\n  - `is_group: boolean`\n  - `updated_at: string`\n  - `group_chat_icon?: string`\n  - `service?: 'iMessage' | 'SMS' | 'RCS'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst chat = await client.chats.retrieve('550e8400-e29b-41d4-a716-446655440000');\n\nconsole.log(chat);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tchat, err := client.Chats.Get(context.TODO(), "550e8400-e29b-41d4-a716-446655440000")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", chat.ID)\n}\n',
      },
      python: {
        method: 'chats.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nchat = client.chats.retrieve(\n    "550e8400-e29b-41d4-a716-446655440000",\n)\nprint(chat.id)',
      },
      typescript: {
        method: 'client.chats.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst chat = await client.chats.retrieve('550e8400-e29b-41d4-a716-446655440000');\n\nconsole.log(chat.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'update',
    endpoint: '/v3/chats/{chatId}',
    httpMethod: 'put',
    summary: 'Update a chat',
    description:
      'Update chat properties such as display name and group chat icon.\n\nListen for `chat.group_name_updated`, `chat.group_icon_updated`,\n`chat.group_name_update_failed`, or `chat.group_icon_update_failed`\nwebhook events to confirm the outcome.\n',
    stainlessPath: '(resource) chats > (method) update',
    qualified: 'client.chats.update',
    params: ['chatId: string;', 'display_name?: string;', 'group_chat_icon?: string;'],
    response: '{ chat_id?: string; status?: string; }',
    markdown:
      "## update\n\n`client.chats.update(chatId: string, display_name?: string, group_chat_icon?: string): { chat_id?: string; status?: string; }`\n\n**put** `/v3/chats/{chatId}`\n\nUpdate chat properties such as display name and group chat icon.\n\nListen for `chat.group_name_updated`, `chat.group_icon_updated`,\n`chat.group_name_update_failed`, or `chat.group_icon_update_failed`\nwebhook events to confirm the outcome.\n\n\n### Parameters\n\n- `chatId: string`\n\n- `display_name?: string`\n  New display name for the chat (group chats only)\n\n- `group_chat_icon?: string`\n  URL of an image to set as the group chat icon (group chats only)\n\n### Returns\n\n- `{ chat_id?: string; status?: string; }`\n\n  - `chat_id?: string`\n  - `status?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst chat = await client.chats.update('550e8400-e29b-41d4-a716-446655440000');\n\nconsole.log(chat);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Update',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tchat, err := client.Chats.Update(\n\t\tcontext.TODO(),\n\t\t"550e8400-e29b-41d4-a716-446655440000",\n\t\tlinqgo.ChatUpdateParams{\n\t\t\tDisplayName: linqgo.String("Team Discussion"),\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", chat.ChatID)\n}\n',
      },
      python: {
        method: 'chats.update',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nchat = client.chats.update(\n    chat_id="550e8400-e29b-41d4-a716-446655440000",\n    display_name="Team Discussion",\n)\nprint(chat.chat_id)',
      },
      typescript: {
        method: 'client.chats.update',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst chat = await client.chats.update('550e8400-e29b-41d4-a716-446655440000', {\n  display_name: 'Team Discussion',\n});\n\nconsole.log(chat.chat_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID \\\n    -X PUT \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "display_name": "Team Discussion",\n          "group_chat_icon": "https://example.com/icon.png"\n        }\'',
      },
    },
  },
  {
    name: 'mark_as_read',
    endpoint: '/v3/chats/{chatId}/read',
    httpMethod: 'post',
    summary: 'Mark chat as read',
    description: 'Mark all messages in a chat as read.\n',
    stainlessPath: '(resource) chats > (method) mark_as_read',
    qualified: 'client.chats.markAsRead',
    params: ['chatId: string;'],
    markdown:
      "## mark_as_read\n\n`client.chats.markAsRead(chatId: string): void`\n\n**post** `/v3/chats/{chatId}/read`\n\nMark all messages in a chat as read.\n\n\n### Parameters\n\n- `chatId: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nawait client.chats.markAsRead('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e')\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.MarkAsRead',
        example:
          'package main\n\nimport (\n\t"context"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\terr := client.Chats.MarkAsRead(context.TODO(), "182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n}\n',
      },
      python: {
        method: 'chats.mark_as_read',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nclient.chats.mark_as_read(\n    "182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e",\n)',
      },
      typescript: {
        method: 'client.chats.markAsRead',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.chats.markAsRead('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/read \\\n    -X POST \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'leave_chat',
    endpoint: '/v3/chats/{chatId}/leave',
    httpMethod: 'post',
    summary: 'Leave a group chat',
    description:
      'Removes your phone number from a group chat. Once you leave, you will no longer receive messages from the group and all interaction endpoints (send message, typing, mark read, etc.) will return 409.\n\nA `participant.removed` webhook will fire once the leave has been processed.\n\n**Supported**\n- iMessage group chats with 4 or more active participants (including yourself)\n\n**Not supported**\n- DM (1-on-1) chats — use the chat directly to continue the conversation\n',
    stainlessPath: '(resource) chats > (method) leave_chat',
    qualified: 'client.chats.leaveChat',
    params: ['chatId: string;'],
    response: '{ message?: string; status?: string; trace_id?: string; }',
    markdown:
      "## leave_chat\n\n`client.chats.leaveChat(chatId: string): { message?: string; status?: string; trace_id?: string; }`\n\n**post** `/v3/chats/{chatId}/leave`\n\nRemoves your phone number from a group chat. Once you leave, you will no longer receive messages from the group and all interaction endpoints (send message, typing, mark read, etc.) will return 409.\n\nA `participant.removed` webhook will fire once the leave has been processed.\n\n**Supported**\n- iMessage group chats with 4 or more active participants (including yourself)\n\n**Not supported**\n- DM (1-on-1) chats — use the chat directly to continue the conversation\n\n\n### Parameters\n\n- `chatId: string`\n\n### Returns\n\n- `{ message?: string; status?: string; trace_id?: string; }`\n\n  - `message?: string`\n  - `status?: string`\n  - `trace_id?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst response = await client.chats.leaveChat('550e8400-e29b-41d4-a716-446655440000');\n\nconsole.log(response);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.LeaveChat',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tresponse, err := client.Chats.LeaveChat(context.TODO(), "550e8400-e29b-41d4-a716-446655440000")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", response.TraceID)\n}\n',
      },
      python: {
        method: 'chats.leave_chat',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.chats.leave_chat(\n    "550e8400-e29b-41d4-a716-446655440000",\n)\nprint(response.trace_id)',
      },
      typescript: {
        method: 'client.chats.leaveChat',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.chats.leaveChat('550e8400-e29b-41d4-a716-446655440000');\n\nconsole.log(response.trace_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/leave \\\n    -X POST \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'share_contact_card',
    endpoint: '/v3/chats/{chatId}/share_contact_card',
    httpMethod: 'post',
    summary: 'Share your contact card with a chat',
    description:
      'Share your contact information (Name and Photo Sharing) with a chat.\n\n**Note:** A contact card must be configured before sharing. You can set up your contact card via the [Contact Card API](#tag/Contact-Card) or on the [Linq dashboard](https://dashboard.linqapp.com/contact-cards).\n',
    stainlessPath: '(resource) chats > (method) share_contact_card',
    qualified: 'client.chats.shareContactCard',
    params: ['chatId: string;'],
    markdown:
      "## share_contact_card\n\n`client.chats.shareContactCard(chatId: string): void`\n\n**post** `/v3/chats/{chatId}/share_contact_card`\n\nShare your contact information (Name and Photo Sharing) with a chat.\n\n**Note:** A contact card must be configured before sharing. You can set up your contact card via the [Contact Card API](#tag/Contact-Card) or on the [Linq dashboard](https://dashboard.linqapp.com/contact-cards).\n\n\n### Parameters\n\n- `chatId: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nawait client.chats.shareContactCard('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e')\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.ShareContactCard',
        example:
          'package main\n\nimport (\n\t"context"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\terr := client.Chats.ShareContactCard(context.TODO(), "182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n}\n',
      },
      python: {
        method: 'chats.share_contact_card',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nclient.chats.share_contact_card(\n    "182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e",\n)',
      },
      typescript: {
        method: 'client.chats.shareContactCard',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.chats.shareContactCard('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/share_contact_card \\\n    -X POST \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'send_voicememo',
    endpoint: '/v3/chats/{chatId}/voicememo',
    httpMethod: 'post',
    summary: 'Send a voice memo to a chat',
    description:
      "Send an audio file as an **iMessage voice memo bubble** to all participants in a chat.\nVoice memos appear with iMessage's native inline playback UI, unlike regular audio\nattachments sent via media parts which appear as downloadable files.\n\n**Supported audio formats:**\n- MP3 (audio/mpeg)\n- M4A (audio/x-m4a, audio/mp4)\n- AAC (audio/aac)\n- CAF (audio/x-caf) - Core Audio Format\n- WAV (audio/wav)\n- AIFF (audio/aiff, audio/x-aiff)\n- AMR (audio/amr)\n",
    stainlessPath: '(resource) chats > (method) send_voicememo',
    qualified: 'client.chats.sendVoicememo',
    params: [
      'chatId: string;',
      'attachment_id?: string;',
      'override_optout?: boolean;',
      'voice_memo_url?: string;',
    ],
    response:
      "{ voice_memo: { id: string; chat: { id: string; handles: chat_handle[]; is_active: boolean; is_group: boolean; service: service_type; }; created_at: string; from: string; status: string; to: string[]; voice_memo: { id: string; filename: string; mime_type: string; size_bytes: number; url: string; duration_ms?: number; }; service?: 'iMessage' | 'SMS' | 'RCS'; }; }",
    markdown:
      "## send_voicememo\n\n`client.chats.sendVoicememo(chatId: string, attachment_id?: string, override_optout?: boolean, voice_memo_url?: string): { voice_memo: object; }`\n\n**post** `/v3/chats/{chatId}/voicememo`\n\nSend an audio file as an **iMessage voice memo bubble** to all participants in a chat.\nVoice memos appear with iMessage's native inline playback UI, unlike regular audio\nattachments sent via media parts which appear as downloadable files.\n\n**Supported audio formats:**\n- MP3 (audio/mpeg)\n- M4A (audio/x-m4a, audio/mp4)\n- AAC (audio/aac)\n- CAF (audio/x-caf) - Core Audio Format\n- WAV (audio/wav)\n- AIFF (audio/aiff, audio/x-aiff)\n- AMR (audio/amr)\n\n\n### Parameters\n\n- `chatId: string`\n\n- `attachment_id?: string`\n  Reference to a voice memo file pre-uploaded via `POST /v3/attachments`.\nThe file is already stored, so sends using this ID skip the download step.\n\nEither `voice_memo_url` or `attachment_id` must be provided, but not both.\n\n\n- `override_optout?: boolean`\n  Send even though the recipient asked you to stop (`403`, error code\n`2024`). Applies to this request only: the opt-out stays in place, so\nthe next send without this flag is rejected again. Every override is\nrecorded against your API key.\n\n\n- `voice_memo_url?: string`\n  URL of the voice memo audio file. Must be a publicly accessible HTTPS URL.\n\nEither `voice_memo_url` or `attachment_id` must be provided, but not both.\n\n\n### Returns\n\n- `{ voice_memo: { id: string; chat: { id: string; handles: chat_handle[]; is_active: boolean; is_group: boolean; service: service_type; }; created_at: string; from: string; status: string; to: string[]; voice_memo: { id: string; filename: string; mime_type: string; size_bytes: number; url: string; duration_ms?: number; }; service?: 'iMessage' | 'SMS' | 'RCS'; }; }`\n  Response for sending a voice memo to a chat\n\n  - `voice_memo: { id: string; chat: { id: string; handles: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]; is_active: boolean; is_group: boolean; service: 'iMessage' | 'SMS' | 'RCS'; }; created_at: string; from: string; status: string; to: string[]; voice_memo: { id: string; filename: string; mime_type: string; size_bytes: number; url: string; duration_ms?: number; }; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst response = await client.chats.sendVoicememo('f19ee7b8-8533-4c5c-83ec-4ef8d6d1ddbd');\n\nconsole.log(response);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.SendVoicememo',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tresponse, err := client.Chats.SendVoicememo(\n\t\tcontext.TODO(),\n\t\t"f19ee7b8-8533-4c5c-83ec-4ef8d6d1ddbd",\n\t\tlinqgo.ChatSendVoicememoParams{\n\t\t\tVoiceMemoURL: linqgo.String("https://example.com/voice-memo.m4a"),\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", response.VoiceMemo)\n}\n',
      },
      python: {
        method: 'chats.send_voicememo',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.chats.send_voicememo(\n    chat_id="f19ee7b8-8533-4c5c-83ec-4ef8d6d1ddbd",\n    voice_memo_url="https://example.com/voice-memo.m4a",\n)\nprint(response.voice_memo)',
      },
      typescript: {
        method: 'client.chats.sendVoicememo',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.chats.sendVoicememo('f19ee7b8-8533-4c5c-83ec-4ef8d6d1ddbd', {\n  voice_memo_url: 'https://example.com/voice-memo.m4a',\n});\n\nconsole.log(response.voice_memo);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/voicememo \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "override_optout": false,\n          "voice_memo_url": "https://example.com/voice-memo.m4a"\n        }\'',
      },
    },
  },
  {
    name: 'add',
    endpoint: '/v3/chats/{chatId}/participants',
    httpMethod: 'post',
    summary: 'Add a participant to a chat',
    description:
      "Add a new participant to an existing group chat.\n\n**Requirements:**\n- Group chats only (3+ existing participants)\n- New participant must support the same messaging service as the group\n- Cross-service additions not allowed (e.g., can't add RCS-only user to iMessage group)\n- For cross-service scenarios, create a new chat instead\n",
    stainlessPath: '(resource) chats.participants > (method) add',
    qualified: 'client.chats.participants.add',
    params: ['chatId: string;', 'handle: string;'],
    response: '{ message?: string; status?: string; trace_id?: string; }',
    markdown:
      "## add\n\n`client.chats.participants.add(chatId: string, handle: string): { message?: string; status?: string; trace_id?: string; }`\n\n**post** `/v3/chats/{chatId}/participants`\n\nAdd a new participant to an existing group chat.\n\n**Requirements:**\n- Group chats only (3+ existing participants)\n- New participant must support the same messaging service as the group\n- Cross-service additions not allowed (e.g., can't add RCS-only user to iMessage group)\n- For cross-service scenarios, create a new chat instead\n\n\n### Parameters\n\n- `chatId: string`\n\n- `handle: string`\n  Phone number (E.164 format) or email address of the participant to add\n\n### Returns\n\n- `{ message?: string; status?: string; trace_id?: string; }`\n\n  - `message?: string`\n  - `status?: string`\n  - `trace_id?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst response = await client.chats.participants.add('550e8400-e29b-41d4-a716-446655440000', { handle: '+12052499136' });\n\nconsole.log(response);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Participants.Add',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tresponse, err := client.Chats.Participants.Add(\n\t\tcontext.TODO(),\n\t\t"550e8400-e29b-41d4-a716-446655440000",\n\t\tlinqgo.ChatParticipantAddParams{\n\t\t\tHandle: "+12052499136",\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", response.TraceID)\n}\n',
      },
      python: {
        method: 'chats.participants.add',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.chats.participants.add(\n    chat_id="550e8400-e29b-41d4-a716-446655440000",\n    handle="+12052499136",\n)\nprint(response.trace_id)',
      },
      typescript: {
        method: 'client.chats.participants.add',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.chats.participants.add('550e8400-e29b-41d4-a716-446655440000', {\n  handle: '+12052499136',\n});\n\nconsole.log(response.trace_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/participants \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "handle": "+12052499136"\n        }\'',
      },
    },
  },
  {
    name: 'remove',
    endpoint: '/v3/chats/{chatId}/participants',
    httpMethod: 'delete',
    summary: 'Remove a participant from a chat',
    description:
      'Remove a participant from an existing group chat.\n\n**Requirements:**\n- Group chats only\n- Must have 3+ participants after removal\n',
    stainlessPath: '(resource) chats.participants > (method) remove',
    qualified: 'client.chats.participants.remove',
    params: ['chatId: string;', 'handle: string;'],
    response: '{ message?: string; status?: string; trace_id?: string; }',
    markdown:
      "## remove\n\n`client.chats.participants.remove(chatId: string, handle: string): { message?: string; status?: string; trace_id?: string; }`\n\n**delete** `/v3/chats/{chatId}/participants`\n\nRemove a participant from an existing group chat.\n\n**Requirements:**\n- Group chats only\n- Must have 3+ participants after removal\n\n\n### Parameters\n\n- `chatId: string`\n\n- `handle: string`\n  Phone number (E.164 format) or email address of the participant to remove\n\n### Returns\n\n- `{ message?: string; status?: string; trace_id?: string; }`\n\n  - `message?: string`\n  - `status?: string`\n  - `trace_id?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst participant = await client.chats.participants.remove('550e8400-e29b-41d4-a716-446655440000', { handle: '+12052499136' });\n\nconsole.log(participant);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Participants.Remove',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tparticipant, err := client.Chats.Participants.Remove(\n\t\tcontext.TODO(),\n\t\t"550e8400-e29b-41d4-a716-446655440000",\n\t\tlinqgo.ChatParticipantRemoveParams{\n\t\t\tHandle: "+12052499136",\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", participant.TraceID)\n}\n',
      },
      python: {
        method: 'chats.participants.remove',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nparticipant = client.chats.participants.remove(\n    chat_id="550e8400-e29b-41d4-a716-446655440000",\n    handle="+12052499136",\n)\nprint(participant.trace_id)',
      },
      typescript: {
        method: 'client.chats.participants.remove',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst participant = await client.chats.participants.remove('550e8400-e29b-41d4-a716-446655440000', {\n  handle: '+12052499136',\n});\n\nconsole.log(participant.trace_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/participants \\\n    -X DELETE \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'start',
    endpoint: '/v3/chats/{chatId}/typing',
    httpMethod: 'post',
    summary: 'Start typing indicator',
    description:
      'Send a typing indicator to show that someone is typing in the chat.\n\n## Behavior\n\nTyping indicators are best-effort signals that behave as follows:\n\n- **iMessage chats only:** Typing indicators are only supported for iMessage chats.\n  Requests for RCS or SMS chats are accepted (`204`) but no indicator is delivered.\n\n- **Send a message first for reliable delivery:** Typing indicators are best-effort.\n  If you have not sent a message in this chat recently (roughly the **last 5 minutes**),\n  a typing indicator may not reach the recipient — the request is still accepted (`204`),\n  but delivery is not deterministic. Once you have sent a message in the chat, typing\n  indicators reliably reach the recipient.\n\n- **No delivery guarantee:** Even for active chats, a `204` response only indicates\n  the request was accepted for processing.\n\n- **Group chats not supported:** Attempting to start a typing indicator in a group chat\n  will return a `403` error.\n\n## Duration & keeping it visible\n\n- A single call shows the indicator for about **85–90 seconds**, then it clears\n  automatically.\n\n- To keep it visible longer, call this endpoint again every **60 seconds**. Each call\n  refreshes the indicator so it stays visible continuously.\n\n- Sending a message clears the indicator.\n\n- To resume typing after sending a message, call this endpoint again.\n\n- Incoming messages do not affect the indicator.\n\n## Recipient re-opening the chat\n\nIf the recipient brings their messaging app to the foreground while the chat has an\nunread message, their device clears any showing typing indicator. Calling this endpoint\nagain on its own may not bring it back. To make it reappear, either send a message, or\ncall `DELETE /v3/chats/{chatId}/typing` (stop) and then call start typing again.\n\n## Recommended usage\n\nCall this endpoint when composing begins, call it again every 60 seconds while\ncomposing, and send the message to clear the indicator. To clear the indicator without\nsending a message, call `DELETE /v3/chats/{chatId}/typing`.\n',
    stainlessPath: '(resource) chats.typing > (method) start',
    qualified: 'client.chats.typing.start',
    params: ['chatId: string;'],
    markdown:
      "## start\n\n`client.chats.typing.start(chatId: string): void`\n\n**post** `/v3/chats/{chatId}/typing`\n\nSend a typing indicator to show that someone is typing in the chat.\n\n## Behavior\n\nTyping indicators are best-effort signals that behave as follows:\n\n- **iMessage chats only:** Typing indicators are only supported for iMessage chats.\n  Requests for RCS or SMS chats are accepted (`204`) but no indicator is delivered.\n\n- **Send a message first for reliable delivery:** Typing indicators are best-effort.\n  If you have not sent a message in this chat recently (roughly the **last 5 minutes**),\n  a typing indicator may not reach the recipient — the request is still accepted (`204`),\n  but delivery is not deterministic. Once you have sent a message in the chat, typing\n  indicators reliably reach the recipient.\n\n- **No delivery guarantee:** Even for active chats, a `204` response only indicates\n  the request was accepted for processing.\n\n- **Group chats not supported:** Attempting to start a typing indicator in a group chat\n  will return a `403` error.\n\n## Duration & keeping it visible\n\n- A single call shows the indicator for about **85–90 seconds**, then it clears\n  automatically.\n\n- To keep it visible longer, call this endpoint again every **60 seconds**. Each call\n  refreshes the indicator so it stays visible continuously.\n\n- Sending a message clears the indicator.\n\n- To resume typing after sending a message, call this endpoint again.\n\n- Incoming messages do not affect the indicator.\n\n## Recipient re-opening the chat\n\nIf the recipient brings their messaging app to the foreground while the chat has an\nunread message, their device clears any showing typing indicator. Calling this endpoint\nagain on its own may not bring it back. To make it reappear, either send a message, or\ncall `DELETE /v3/chats/{chatId}/typing` (stop) and then call start typing again.\n\n## Recommended usage\n\nCall this endpoint when composing begins, call it again every 60 seconds while\ncomposing, and send the message to clear the indicator. To clear the indicator without\nsending a message, call `DELETE /v3/chats/{chatId}/typing`.\n\n\n### Parameters\n\n- `chatId: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nawait client.chats.typing.start('550e8400-e29b-41d4-a716-446655440000')\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Typing.Start',
        example:
          'package main\n\nimport (\n\t"context"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\terr := client.Chats.Typing.Start(context.TODO(), "550e8400-e29b-41d4-a716-446655440000")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n}\n',
      },
      python: {
        method: 'chats.typing.start',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nclient.chats.typing.start(\n    "550e8400-e29b-41d4-a716-446655440000",\n)',
      },
      typescript: {
        method: 'client.chats.typing.start',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.chats.typing.start('550e8400-e29b-41d4-a716-446655440000');",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/typing \\\n    -X POST \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'stop',
    endpoint: '/v3/chats/{chatId}/typing',
    httpMethod: 'delete',
    summary: 'Stop typing indicator',
    description:
      'Immediately clears the typing indicator for the chat, without sending a message.\n\nThe typing indicator also clears automatically when you send a message, or about\n85–90 seconds after the last `POST /v3/chats/{chatId}/typing` (start typing) request.\n\nSee the start typing endpoint (`POST /v3/chats/{chatId}/typing`) above for behavior\ndetails.\n\n**Note:** Group chats are not supported and will return a `403` error.\n',
    stainlessPath: '(resource) chats.typing > (method) stop',
    qualified: 'client.chats.typing.stop',
    params: ['chatId: string;'],
    markdown:
      "## stop\n\n`client.chats.typing.stop(chatId: string): void`\n\n**delete** `/v3/chats/{chatId}/typing`\n\nImmediately clears the typing indicator for the chat, without sending a message.\n\nThe typing indicator also clears automatically when you send a message, or about\n85–90 seconds after the last `POST /v3/chats/{chatId}/typing` (start typing) request.\n\nSee the start typing endpoint (`POST /v3/chats/{chatId}/typing`) above for behavior\ndetails.\n\n**Note:** Group chats are not supported and will return a `403` error.\n\n\n### Parameters\n\n- `chatId: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nawait client.chats.typing.stop('550e8400-e29b-41d4-a716-446655440000')\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Typing.Stop',
        example:
          'package main\n\nimport (\n\t"context"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\terr := client.Chats.Typing.Stop(context.TODO(), "550e8400-e29b-41d4-a716-446655440000")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n}\n',
      },
      python: {
        method: 'chats.typing.stop',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nclient.chats.typing.stop(\n    "550e8400-e29b-41d4-a716-446655440000",\n)',
      },
      typescript: {
        method: 'client.chats.typing.stop',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.chats.typing.stop('550e8400-e29b-41d4-a716-446655440000');",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/typing \\\n    -X DELETE \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'send',
    endpoint: '/v3/chats/{chatId}/messages',
    httpMethod: 'post',
    summary: 'Send a message to an existing chat',
    description:
      'Send a message to an existing chat. Use this endpoint when you already have\na chat ID and want to send additional messages to it.\n\n## Message Effects\n\nYou can add iMessage effects to make your messages more expressive. Effects are\noptional and can be either screen effects (full-screen animations) or bubble effects\n(message bubble animations).\n\n**Screen Effects:** `confetti`, `fireworks`, `lasers`, `sparkles`, `celebration`,\n`hearts`, `love`, `balloons`, `happy_birthday`, `echo`, `spotlight`\n\n**Bubble Effects:** `slam`, `loud`, `gentle`, `invisible`\n\nOnly one effect type can be applied per message.\n\n## Inline Text Decorations (iMessage only)\n\nUse the `text_decorations` array on a text part to apply styling and animations to character ranges.\n\nEach decoration specifies a `range: [start, end)` and exactly one of `style` or `animation`.\n\n**Styles:** `bold`, `italic`, `strikethrough`, `underline`\n**Animations:** `big`, `small`, `shake`, `nod`, `explode`, `ripple`, `bloom`, `jitter`\n\n```json\n{\n  "type": "text",\n  "value": "Hello world",\n  "text_decorations": [\n    { "range": [0, 5], "style": "bold" },\n    { "range": [6, 11], "animation": "shake" }\n  ]\n}\n```\n\n**Note:** Style ranges (bold, italic, etc.) may overlap, but animation ranges must not overlap with other animations or styles. Text decorations only render for iMessage recipients.\nFor SMS/RCS, text decorations are not applied.\n',
    stainlessPath: '(resource) chats.messages > (method) send',
    qualified: 'client.chats.messages.send',
    params: [
      'chatId: string;',
      "message: { action?: { action: string; experience: string; params?: object; }; effect?: { name?: string; type?: 'screen' | 'bubble'; }; idempotency_key?: string; parts?: { type: 'text'; value: string; mention?: string; mention_range?: number[]; text_decorations?: text_decoration[]; } | { type: 'media'; attachment_id?: string; url?: string; } | { type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; type: 'imessage_app'; fallback_text?: string; interactive?: boolean; url?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: { message_id: string; part_index?: number; }; };",
      'override_optout?: boolean;',
    ],
    response:
      "{ chat_id: string; message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: text_part_response | media_part_response | link_part_response | object[]; sent_at: string; delivered_at?: string; effect?: message_effect; from_handle?: chat_handle; preferred_service?: service_type; reply_to?: reply_to; service?: service_type; }; }",
    markdown:
      "## send\n\n`client.chats.messages.send(chatId: string, message: { action?: object; effect?: message_effect; idempotency_key?: string; parts?: text_part | media_part | link_part | object[]; preferred_service?: service_type; reply_to?: reply_to; }, override_optout?: boolean): { chat_id: string; message: sent_message; }`\n\n**post** `/v3/chats/{chatId}/messages`\n\nSend a message to an existing chat. Use this endpoint when you already have\na chat ID and want to send additional messages to it.\n\n## Message Effects\n\nYou can add iMessage effects to make your messages more expressive. Effects are\noptional and can be either screen effects (full-screen animations) or bubble effects\n(message bubble animations).\n\n**Screen Effects:** `confetti`, `fireworks`, `lasers`, `sparkles`, `celebration`,\n`hearts`, `love`, `balloons`, `happy_birthday`, `echo`, `spotlight`\n\n**Bubble Effects:** `slam`, `loud`, `gentle`, `invisible`\n\nOnly one effect type can be applied per message.\n\n## Inline Text Decorations (iMessage only)\n\nUse the `text_decorations` array on a text part to apply styling and animations to character ranges.\n\nEach decoration specifies a `range: [start, end)` and exactly one of `style` or `animation`.\n\n**Styles:** `bold`, `italic`, `strikethrough`, `underline`\n**Animations:** `big`, `small`, `shake`, `nod`, `explode`, `ripple`, `bloom`, `jitter`\n\n```json\n{\n  \"type\": \"text\",\n  \"value\": \"Hello world\",\n  \"text_decorations\": [\n    { \"range\": [0, 5], \"style\": \"bold\" },\n    { \"range\": [6, 11], \"animation\": \"shake\" }\n  ]\n}\n```\n\n**Note:** Style ranges (bold, italic, etc.) may overlap, but animation ranges must not overlap with other animations or styles. Text decorations only render for iMessage recipients.\nFor SMS/RCS, text decorations are not applied.\n\n\n### Parameters\n\n- `chatId: string`\n\n- `message: { action?: { action: string; experience: string; params?: object; }; effect?: { name?: string; type?: 'screen' | 'bubble'; }; idempotency_key?: string; parts?: { type: 'text'; value: string; mention?: string; mention_range?: number[]; text_decorations?: text_decoration[]; } | { type: 'media'; attachment_id?: string; url?: string; } | { type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; type: 'imessage_app'; fallback_text?: string; interactive?: boolean; url?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: { message_id: string; part_index?: number; }; }`\n  Message content container. Groups all message-related fields together,\nseparating the \"what\" (message content) from the \"where\" (routing fields like from/to).\n\nA message carries EITHER `parts` — text and attachments, which compose\ninto one bubble — or a single `action`, which invokes an experience\ninside Linq's iMessage app. Never both: an app card is the whole message\n(Apple's `MSMessage` cannot coexist with text), so copy and a card are\ntwo sends, not one.\n\n  - `action?: { action: string; experience: string; params?: object; }`\n    Invokes an action on an experience — a third party that renders inside\nLinq's iMessage app. Linq resolves the recipient's connection, mints any\nsession the action needs, composes the card and sends it; none of that\nis visible to you.\n\nCall `GET /v3/experiences/{experience}` for the actions you may invoke\nand the fields each accepts.\n\n  - `effect?: { name?: string; type?: 'screen' | 'bubble'; }`\n    iMessage effect to apply to this message (screen or bubble effect)\n  - `idempotency_key?: string`\n    Optional idempotency key for this message.\nUse this to prevent duplicate sends of the same message. Reusing a key\nwhose message was deleted — or was an ephemeral message that has since\nexpired — returns 404; the message is never resent.\n\n  - `parts?: { type: 'text'; value: string; mention?: string; mention_range?: number[]; text_decorations?: { range: number[]; animation?: 'big' | 'small' | 'shake' | 'nod' | 'explode' | 'ripple' | 'bloom' | 'jitter'; style?: 'bold' | 'italic' | 'strikethrough' | 'underline'; }[]; } | { type: 'media'; attachment_id?: string; url?: string; } | { type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; type: 'imessage_app'; fallback_text?: string; interactive?: boolean; url?: string; }[]`\n    Array of message parts. Each part can be text, media, or link.\nParts are displayed in order. Text and media can be mixed freely,\nbut a `link` part must be the only part in the message.\n\n**Rich Link Previews:**\n- Use a `link` part to send a URL with a rich preview card\n- A `link` part must be the **only** part in the message\n- To send a URL as plain text (no preview), use a `text` part instead\n\n**Supported Media:**\n- Images: .jpg, .jpeg, .png, .gif, .heic, .heif, .tif, .tiff, .bmp\n- Videos: .mp4, .mov, .m4v, .mpeg, .mpg, .3gp\n- Audio: .m4a, .mp3, .aac, .caf, .wav, .aiff, .amr\n- Documents: .pdf, .txt, .rtf, .csv, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pages, .numbers, .key, .epub, .zip, .html, .htm\n- Contact & Calendar: .vcf, .ics\n\n**Audio:**\n- Audio files (.m4a, .mp3, .aac, .caf, .wav, .aiff, .amr) are fully supported as media parts\n- To send audio as an **iMessage voice memo bubble** (inline playback UI), use the dedicated\n  `/v3/chats/{chatId}/voicememo` endpoint instead\n\n**Validation Rules:**\n- A `link` part must be the **only** part in the message. It cannot be combined\n  with text or media parts.\n- Consecutive text parts are not allowed. Text parts must be separated by\n  media parts. For example, [text, text] is invalid, but [text, media, text] is valid.\n- Maximum of **100 parts** total.\n- Media parts using a public `url` (downloaded by the server on send) are\n  capped at **40**. Parts using `attachment_id` or presigned URLs\n  are exempt from this sub-limit. For bulk media sends exceeding 40 files,\n  pre-upload via `POST /v3/attachments` and reference by `attachment_id` or `download_url`.\n\n  - `preferred_service?: 'iMessage' | 'SMS' | 'RCS'`\n    Messaging service type\n  - `reply_to?: { message_id: string; part_index?: number; }`\n    Reply to another message to create a threaded conversation\n\n- `override_optout?: boolean`\n  Send even though the recipient asked you to stop (`403`, error code\n`2024`). Applies to this request only: the opt-out stays in place, so\nthe next send without this flag is rejected again. Every override is\nrecorded against your API key.\n\n\n### Returns\n\n- `{ chat_id: string; message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: text_part_response | media_part_response | link_part_response | object[]; sent_at: string; delivered_at?: string; effect?: message_effect; from_handle?: chat_handle; preferred_service?: service_type; reply_to?: reply_to; service?: service_type; }; }`\n  Response for sending a message to a chat\n\n  - `chat_id: string`\n  - `message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: { reactions: reaction[]; type: 'text'; value: string; text_decorations?: text_decoration[]; } | { id: string; filename: string; mime_type: string; reactions: reaction[]; size_bytes: number; type: 'media'; url: string; } | { reactions: reaction[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: object[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; sent_at: string; delivered_at?: string; effect?: { name?: string; type?: 'screen' | 'bubble'; }; from_handle?: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: { message_id: string; part_index?: number; }; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst response = await client.chats.messages.send('550e8400-e29b-41d4-a716-446655440000', { message: {} });\n\nconsole.log(response);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Messages.Send',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tresponse, err := client.Chats.Messages.Send(\n\t\tcontext.TODO(),\n\t\t"550e8400-e29b-41d4-a716-446655440000",\n\t\tlinqgo.ChatMessageSendParams{\n\t\t\tMessage: linqgo.MessageContentParam{\n\t\t\t\tParts: []linqgo.MessageContentPartUnionParam{{\n\t\t\t\t\tOfText: &linqgo.TextPartParam{\n\t\t\t\t\t\tType:  linqgo.TextPartTypeText,\n\t\t\t\t\t\tValue: "Hello, world!",\n\t\t\t\t\t},\n\t\t\t\t}},\n\t\t\t},\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", response.ChatID)\n}\n',
      },
      python: {
        method: 'chats.messages.send',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.chats.messages.send(\n    chat_id="550e8400-e29b-41d4-a716-446655440000",\n    message={\n        "parts": [{\n            "type": "text",\n            "value": "Hello, world!",\n        }]\n    },\n)\nprint(response.chat_id)',
      },
      typescript: {
        method: 'client.chats.messages.send',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.chats.messages.send('550e8400-e29b-41d4-a716-446655440000', {\n  message: { parts: [{ type: 'text', value: 'Hello, world!' }] },\n});\n\nconsole.log(response.chat_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/messages \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "message": {\n            "parts": [\n              {\n                "type": "text",\n                "value": "Hello, world!"\n              }\n            ]\n          },\n          "override_optout": false\n        }\'',
      },
    },
  },
  {
    name: 'list',
    endpoint: '/v3/chats/{chatId}/messages',
    httpMethod: 'get',
    summary: 'Get messages from a chat',
    description: 'Retrieve messages from a specific chat with pagination support.\n',
    stainlessPath: '(resource) chats.messages > (method) list',
    qualified: 'client.chats.messages.list',
    params: ['chatId: string;', 'cursor?: string;', 'limit?: number;'],
    response:
      "{ id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: object; from?: string; from_handle?: object; parts?: object | object | object | { app: object; layout: object; reactions: reaction[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; read_at?: string; reconciled_at?: string; reply_to?: object; sent_at?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }",
    markdown:
      "## list\n\n`client.chats.messages.list(chatId: string, cursor?: string, limit?: number): { id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: message_effect; from?: string; from_handle?: chat_handle; parts?: text_part_response | media_part_response | link_part_response | object[]; preferred_service?: service_type; read_at?: string; reconciled_at?: string; reply_to?: reply_to; sent_at?: string; service?: service_type; }`\n\n**get** `/v3/chats/{chatId}/messages`\n\nRetrieve messages from a specific chat with pagination support.\n\n\n### Parameters\n\n- `chatId: string`\n\n- `cursor?: string`\n  Pagination cursor from previous next_cursor response\n\n- `limit?: number`\n  Maximum number of messages to return\n\n### Returns\n\n- `{ id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: { name?: string; type?: 'screen' | 'bubble'; }; from?: string; from_handle?: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; parts?: { reactions: reaction[]; type: 'text'; value: string; text_decorations?: text_decoration[]; } | { id: string; filename: string; mime_type: string; reactions: reaction[]; size_bytes: number; type: 'media'; url: string; } | { reactions: reaction[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: object[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; read_at?: string; reconciled_at?: string; reply_to?: { message_id: string; part_index?: number; }; sent_at?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n\n  - `id: string`\n  - `chat_id: string`\n  - `created_at: string`\n  - `delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'`\n  - `is_delivered: boolean`\n  - `is_from_me: boolean`\n  - `is_read: boolean`\n  - `updated_at: string`\n  - `delivered_at?: string`\n  - `effect?: { name?: string; type?: 'screen' | 'bubble'; }`\n  - `from?: string`\n  - `from_handle?: { id: string; handle: string; joined_at: string; service: 'iMessage' | 'SMS' | 'RCS'; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }`\n  - `parts?: { reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; type: 'text'; value: string; text_decorations?: { range: number[]; animation?: 'big' | 'small' | 'shake' | 'nod' | 'explode' | 'ripple' | 'bloom' | 'jitter'; style?: 'bold' | 'italic' | 'strikethrough' | 'underline'; }[]; } | { id: string; filename: string; mime_type: string; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; size_bytes: number; type: 'media'; url: string; } | { reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: { handle: object; is_me: boolean; type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker'; custom_emoji?: string; sticker?: { file_name?: string; height?: number; mime_type?: string; url?: string; width?: number; }; }[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]`\n  - `preferred_service?: 'iMessage' | 'SMS' | 'RCS'`\n  - `read_at?: string`\n  - `reconciled_at?: string`\n  - `reply_to?: { message_id: string; part_index?: number; }`\n  - `sent_at?: string`\n  - `service?: 'iMessage' | 'SMS' | 'RCS'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\n// Automatically fetches more pages as needed.\nfor await (const message of client.chats.messages.list('550e8400-e29b-41d4-a716-446655440000')) {\n  console.log(message);\n}\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Messages.List',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpage, err := client.Chats.Messages.List(\n\t\tcontext.TODO(),\n\t\t"550e8400-e29b-41d4-a716-446655440000",\n\t\tlinqgo.ChatMessageListParams{},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", page)\n}\n',
      },
      python: {
        method: 'chats.messages.list',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npage = client.chats.messages.list(\n    chat_id="550e8400-e29b-41d4-a716-446655440000",\n)\npage = page.messages[0]\nprint(page.id)',
      },
      typescript: {
        method: 'client.chats.messages.list',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\n// Automatically fetches more pages as needed.\nfor await (const message of client.chats.messages.list('550e8400-e29b-41d4-a716-446655440000')) {\n  console.log(message.id);\n}",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/messages \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'request',
    endpoint: '/v3/chats/{chatId}/location/request',
    httpMethod: 'post',
    summary: 'Request location sharing',
    description:
      'Request a contact in a chat to share their location. They receive an iMessage\nprompt and must accept before any location is available; once they do, read their\nlocation coordinates with `GET /v3/chats/{chatId}/location`.\n\nThe request is delivered asynchronously. The endpoint returns immediately with\n`{ "success": true, "message": "Location request sent" }` and does not return\ncoordinates.\n\nLocation requests only work in **1:1 iMessage chats** (Apple limitation):\n\n- Group chats (any service) return `409` with code `2016`\n  (`GroupChatNotSupported`).\n- 1:1 SMS and RCS chats return `409` with code `2017`\n  (`ChatServiceNotSupported`).\n',
    stainlessPath: '(resource) chats.location > (method) request',
    qualified: 'client.chats.location.request',
    params: ['chatId: string;'],
    response: '{ message: string; success: boolean; }',
    markdown:
      '## request\n\n`client.chats.location.request(chatId: string): { message: string; success: boolean; }`\n\n**post** `/v3/chats/{chatId}/location/request`\n\nRequest a contact in a chat to share their location. They receive an iMessage\nprompt and must accept before any location is available; once they do, read their\nlocation coordinates with `GET /v3/chats/{chatId}/location`.\n\nThe request is delivered asynchronously. The endpoint returns immediately with\n`{ "success": true, "message": "Location request sent" }` and does not return\ncoordinates.\n\nLocation requests only work in **1:1 iMessage chats** (Apple limitation):\n\n- Group chats (any service) return `409` with code `2016`\n  (`GroupChatNotSupported`).\n- 1:1 SMS and RCS chats return `409` with code `2017`\n  (`ChatServiceNotSupported`).\n\n\n### Parameters\n\n- `chatId: string`\n\n### Returns\n\n- `{ message: string; success: boolean; }`\n\n  - `message: string`\n  - `success: boolean`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from \'@linqapp/sdk\';\n\nconst client = new LinqAPIV3();\n\nconst locationRequestResponse = await client.chats.location.request(\'975d0776-bd17-4273-8337-f346b4c661b0\');\n\nconsole.log(locationRequestResponse);\n```',
    perLanguage: {
      go: {
        method: 'client.Chats.Location.Request',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tlocationRequestResponse, err := client.Chats.Location.Request(context.TODO(), "975d0776-bd17-4273-8337-f346b4c661b0")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", locationRequestResponse.Message)\n}\n',
      },
      python: {
        method: 'chats.location.request',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nlocation_request_response = client.chats.location.request(\n    "975d0776-bd17-4273-8337-f346b4c661b0",\n)\nprint(location_request_response.message)',
      },
      typescript: {
        method: 'client.chats.location.request',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst locationRequestResponse = await client.chats.location.request(\n  '975d0776-bd17-4273-8337-f346b4c661b0',\n);\n\nconsole.log(locationRequestResponse.message);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/location/request \\\n    -X POST \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/chats/{chatId}/location',
    httpMethod: 'get',
    summary: 'Get location data',
    description:
      'Retrieve the current location for contacts sharing with you in a chat.\n\nThe response is wrapped in the standard `{ "success": true, "data": ... }` envelope —\nthe body is **not** a bare GeoJSON document. `data` is a\n[GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946) `FeatureCollection` with a\n`Feature` for each participant actively sharing their location.\n\nWorks for both 1:1 and group chats. In group chats, `data.features` contains a separate\nfeature for each participant who is sharing. Each feature\'s `properties.handle` identifies the user.\n\nReturns an empty `data.features` array if no one is sharing or no location data is\navailable yet. If sharing started but this stays empty, see the **Location Sharing**\noverview.\n\nPoll this endpoint to track a moving contact. `properties.updated_at`\nreflects when each participant\'s location was last updated. There is no\ncoordinate-update webhook. See the **Location Sharing** overview for polling\nguidance.\n',
    stainlessPath: '(resource) chats.location > (method) retrieve',
    qualified: 'client.chats.location.retrieve',
    params: ['chatId: string;'],
    response:
      "{ data: { features: { geometry: object; properties: object; type: 'Feature'; }[]; type: 'FeatureCollection'; }; success: boolean; }",
    markdown:
      "## retrieve\n\n`client.chats.location.retrieve(chatId: string): { data: object; success: boolean; }`\n\n**get** `/v3/chats/{chatId}/location`\n\nRetrieve the current location for contacts sharing with you in a chat.\n\nThe response is wrapped in the standard `{ \"success\": true, \"data\": ... }` envelope —\nthe body is **not** a bare GeoJSON document. `data` is a\n[GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946) `FeatureCollection` with a\n`Feature` for each participant actively sharing their location.\n\nWorks for both 1:1 and group chats. In group chats, `data.features` contains a separate\nfeature for each participant who is sharing. Each feature's `properties.handle` identifies the user.\n\nReturns an empty `data.features` array if no one is sharing or no location data is\navailable yet. If sharing started but this stays empty, see the **Location Sharing**\noverview.\n\nPoll this endpoint to track a moving contact. `properties.updated_at`\nreflects when each participant's location was last updated. There is no\ncoordinate-update webhook. See the **Location Sharing** overview for polling\nguidance.\n\n\n### Parameters\n\n- `chatId: string`\n\n### Returns\n\n- `{ data: { features: { geometry: object; properties: object; type: 'Feature'; }[]; type: 'FeatureCollection'; }; success: boolean; }`\n\n  - `data: { features: { geometry: { coordinates: number[]; type: 'Point'; }; properties: { handle: string; address?: string; locality?: string; updated_at?: string; }; type: 'Feature'; }[]; type: 'FeatureCollection'; }`\n  - `success: boolean`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst getChatLocationResponse = await client.chats.location.retrieve('975d0776-bd17-4273-8337-f346b4c661b0');\n\nconsole.log(getChatLocationResponse);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Location.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tgetChatLocationResponse, err := client.Chats.Location.Get(context.TODO(), "975d0776-bd17-4273-8337-f346b4c661b0")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", getChatLocationResponse.Data)\n}\n',
      },
      python: {
        method: 'chats.location.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nget_chat_location_response = client.chats.location.retrieve(\n    "975d0776-bd17-4273-8337-f346b4c661b0",\n)\nprint(get_chat_location_response.data)',
      },
      typescript: {
        method: 'client.chats.location.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst getChatLocationResponse = await client.chats.location.retrieve(\n  '975d0776-bd17-4273-8337-f346b4c661b0',\n);\n\nconsole.log(getChatLocationResponse.data);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/location \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'create',
    endpoint: '/v3/chats/{chatId}/polls',
    httpMethod: 'post',
    summary: 'Create and send a poll in a chat',
    description:
      'Create an iMessage poll in an existing chat and send it. Polls are iMessage-only.\n\nThe chat must already exist — **a poll cannot be the first message of a\nnew chat** (use `POST /v3/chats` for that). Options are **add-only and immutable**: you\ncan add options later via `POST /v3/messages/{messageId}/poll/options`, but never edit\nor remove them.\n',
    stainlessPath: '(resource) chats.polls > (method) create',
    qualified: 'client.chats.polls.create',
    params: ['chatId: string;', 'poll: { options: { text: string; }[]; idempotency_key?: string; };'],
    response:
      '{ chat_id: string; created_at: string; message_id: string; poll: { options: object[]; total_voters: number; }; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; updated_at: string; }',
    markdown:
      "## create\n\n`client.chats.polls.create(chatId: string, poll: { options: { text: string; }[]; idempotency_key?: string; }): { chat_id: string; created_at: string; message_id: string; poll: poll; reactions: reaction[]; updated_at: string; }`\n\n**post** `/v3/chats/{chatId}/polls`\n\nCreate an iMessage poll in an existing chat and send it. Polls are iMessage-only.\n\nThe chat must already exist — **a poll cannot be the first message of a\nnew chat** (use `POST /v3/chats` for that). Options are **add-only and immutable**: you\ncan add options later via `POST /v3/messages/{messageId}/poll/options`, but never edit\nor remove them.\n\n\n### Parameters\n\n- `chatId: string`\n\n- `poll: { options: { text: string; }[]; idempotency_key?: string; }`\n  Poll content to create. A poll needs at least two options. Options are add-only and\nimmutable — there is no title/question (send that as a normal text message).\n\n  - `options: { text: string; }[]`\n  - `idempotency_key?: string`\n    Optional key to deduplicate the poll creation.\n\n### Returns\n\n- `{ chat_id: string; created_at: string; message_id: string; poll: { options: object[]; total_voters: number; }; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; updated_at: string; }`\n  Message-level envelope returned by every poll endpoint.\n\n  - `chat_id: string`\n  - `created_at: string`\n  - `message_id: string`\n  - `poll: { options: { can_be_edited: boolean; creator_handle: object; option_id: string; text: string; voters: { handle: string; voted_at: string; }[]; }[]; total_voters: number; }`\n  - `reactions: { handle: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; is_me: boolean; type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker'; custom_emoji?: string; sticker?: { file_name?: string; height?: number; mime_type?: string; url?: string; width?: number; }; }[]`\n  - `updated_at: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst pollEnvelope = await client.chats.polls.create('550e8400-e29b-41d4-a716-446655440000', { poll: { options: [{ text: 'Tacos' }, { text: 'Sushi' }] } });\n\nconsole.log(pollEnvelope);\n```",
    perLanguage: {
      go: {
        method: 'client.Chats.Polls.New',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpollEnvelope, err := client.Chats.Polls.New(\n\t\tcontext.TODO(),\n\t\t"550e8400-e29b-41d4-a716-446655440000",\n\t\tlinqgo.ChatPollNewParams{\n\t\t\tPoll: linqgo.ChatPollNewParamsPoll{\n\t\t\t\tOptions: []linqgo.ChatPollNewParamsPollOption{{\n\t\t\t\t\tText: "Tacos",\n\t\t\t\t}, {\n\t\t\t\t\tText: "Sushi",\n\t\t\t\t}},\n\t\t\t\tIdempotencyKey: linqgo.String("poll-abc123"),\n\t\t\t},\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", pollEnvelope.ChatID)\n}\n',
      },
      python: {
        method: 'chats.polls.create',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npoll_envelope = client.chats.polls.create(\n    chat_id="550e8400-e29b-41d4-a716-446655440000",\n    poll={\n        "options": [{\n            "text": "Tacos"\n        }, {\n            "text": "Sushi"\n        }],\n        "idempotency_key": "poll-abc123",\n    },\n)\nprint(poll_envelope.chat_id)',
      },
      typescript: {
        method: 'client.chats.polls.create',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst pollEnvelope = await client.chats.polls.create('550e8400-e29b-41d4-a716-446655440000', {\n  poll: { options: [{ text: 'Tacos' }, { text: 'Sushi' }], idempotency_key: 'poll-abc123' },\n});\n\nconsole.log(pollEnvelope.chat_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/chats/$CHAT_ID/polls \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "poll": {\n            "options": [\n              {\n                "text": "Tacos"\n              },\n              {\n                "text": "Sushi"\n              }\n            ],\n            "idempotency_key": "poll-abc123"\n          }\n        }\'',
      },
    },
  },
  {
    name: 'create',
    endpoint: '/v3/messages',
    httpMethod: 'post',
    summary: 'Send a message (auto-selected from-number)',
    description:
      'Send a message to one or more recipients **without supplying a `from`\nnumber**. Linq resolves both the sending line and the target chat for you,\nthen returns exactly which line was used, which chat the message landed in,\nwhether a new chat was created, and every resulting message id.\n\nThis fuses "create chat" and "send message" behind a single\nmessage-centric resource. Provide only the recipients (`to`) and the\n`message`; the platform decides the rest.\n\n## How the from-number and chat are chosen\n\n- **Reuse** — if a chat with exactly these recipients already exists on a\n  line that can still send, the message is sent into that chat on its\n  existing line (`from_selection.reason = reused_active_chat`). The\n  most-recently-active such chat wins; chats stranded on flagged lines\n  (e.g. by an earlier failover) are skipped.\n- **New** — if no such chat exists, a new chat is created on the best\n  available line (`from_selection.reason = new_best_number`).\n- **Failover** — if matching chats exist but none is on a line that can\n  send, a **new** chat is created on a fresh best line and the flagged chat\n  is abandoned (`from_selection.reason = failover_flagged`,\n  `previous_chat_id` set). If you supply `continuation_message`, that\n  text is sent as the single message INSTEAD of `message` (useful as a\n  fresh-number-appropriate opener). Exactly one message is sent either way.\n\nRecipients (`to`) are an order-independent set: a single handle is a direct\nchat, multiple handles a group chat.\n\n## Excluding lines\n\n`exclude_from` keeps specific lines out of **this** send\'s line pick. It\nonly affects picking a line for a new chat — an existing chat is always\nreused on its own line, preferring a chat on a non-excluded line when the\nrecipients have more than one. An exclusion never abandons a live chat or\nmoves it to a new number, so if the only chat these recipients have is on\nan excluded line, that chat is still used. `from` tells you the line that\nwas actually used.\n\n## Differences from POST /v3/chats\n\n- The first message **may contain a link** (including for a newly created\n  chat). Note: sending a link as the very first message on a freshly\n  selected line can elevate that line\'s flagging risk — it is allowed, not\n  recommended.\n- Voice memos are **not** supported here. To send an iMessage voice-memo\n  bubble, use `POST /v3/chats/{chatId}/voicememo` with a known chat id.\n\n## Service preference, effects, decorations\n\nSet `message.preferred_service` (`iMessage` | `RCS` | `SMS`), `message.effect`,\nand per-part `text_decorations` exactly as on the other send endpoints.\n\nAlways responds `202 Accepted` — chat creation is incidental to the send.\n',
    stainlessPath: '(resource) messages > (method) create',
    qualified: 'client.messages.create',
    params: [
      "message: { action?: { action: string; experience: string; params?: object; }; effect?: { name?: string; type?: 'screen' | 'bubble'; }; idempotency_key?: string; parts?: { type: 'text'; value: string; mention?: string; mention_range?: number[]; text_decorations?: text_decoration[]; } | { type: 'media'; attachment_id?: string; url?: string; } | { type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; type: 'imessage_app'; fallback_text?: string; interactive?: boolean; url?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: { message_id: string; part_index?: number; }; };",
      'to: string[];',
      'continuation_message?: { text: string; };',
      'exclude_from?: string[];',
      'override_optout?: boolean;',
      'Idempotency-Key?: string;',
    ],
    response:
      "{ chat_id: string; created_new_chat: boolean; from: string; from_selection: { reason: 'reused_active_chat' | 'new_best_number' | 'failover_flagged'; reused_existing_chat: boolean; }; handles: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]; is_group: boolean; message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: text_part_response | media_part_response | link_part_response | object[]; sent_at: string; delivered_at?: string; effect?: message_effect; from_handle?: chat_handle; preferred_service?: service_type; reply_to?: reply_to; service?: service_type; }; service: 'iMessage' | 'SMS' | 'RCS'; previous_chat_id?: string; }",
    markdown:
      "## create\n\n`client.messages.create(message: { action?: object; effect?: message_effect; idempotency_key?: string; parts?: text_part | media_part | link_part | object[]; preferred_service?: service_type; reply_to?: reply_to; }, to: string[], continuation_message?: { text: string; }, exclude_from?: string[], override_optout?: boolean, Idempotency-Key?: string): { chat_id: string; created_new_chat: boolean; from: string; from_selection: object; handles: chat_handle[]; is_group: boolean; message: sent_message; service: service_type; previous_chat_id?: string; }`\n\n**post** `/v3/messages`\n\nSend a message to one or more recipients **without supplying a `from`\nnumber**. Linq resolves both the sending line and the target chat for you,\nthen returns exactly which line was used, which chat the message landed in,\nwhether a new chat was created, and every resulting message id.\n\nThis fuses \"create chat\" and \"send message\" behind a single\nmessage-centric resource. Provide only the recipients (`to`) and the\n`message`; the platform decides the rest.\n\n## How the from-number and chat are chosen\n\n- **Reuse** — if a chat with exactly these recipients already exists on a\n  line that can still send, the message is sent into that chat on its\n  existing line (`from_selection.reason = reused_active_chat`). The\n  most-recently-active such chat wins; chats stranded on flagged lines\n  (e.g. by an earlier failover) are skipped.\n- **New** — if no such chat exists, a new chat is created on the best\n  available line (`from_selection.reason = new_best_number`).\n- **Failover** — if matching chats exist but none is on a line that can\n  send, a **new** chat is created on a fresh best line and the flagged chat\n  is abandoned (`from_selection.reason = failover_flagged`,\n  `previous_chat_id` set). If you supply `continuation_message`, that\n  text is sent as the single message INSTEAD of `message` (useful as a\n  fresh-number-appropriate opener). Exactly one message is sent either way.\n\nRecipients (`to`) are an order-independent set: a single handle is a direct\nchat, multiple handles a group chat.\n\n## Excluding lines\n\n`exclude_from` keeps specific lines out of **this** send's line pick. It\nonly affects picking a line for a new chat — an existing chat is always\nreused on its own line, preferring a chat on a non-excluded line when the\nrecipients have more than one. An exclusion never abandons a live chat or\nmoves it to a new number, so if the only chat these recipients have is on\nan excluded line, that chat is still used. `from` tells you the line that\nwas actually used.\n\n## Differences from POST /v3/chats\n\n- The first message **may contain a link** (including for a newly created\n  chat). Note: sending a link as the very first message on a freshly\n  selected line can elevate that line's flagging risk — it is allowed, not\n  recommended.\n- Voice memos are **not** supported here. To send an iMessage voice-memo\n  bubble, use `POST /v3/chats/{chatId}/voicememo` with a known chat id.\n\n## Service preference, effects, decorations\n\nSet `message.preferred_service` (`iMessage` | `RCS` | `SMS`), `message.effect`,\nand per-part `text_decorations` exactly as on the other send endpoints.\n\nAlways responds `202 Accepted` — chat creation is incidental to the send.\n\n\n### Parameters\n\n- `message: { action?: { action: string; experience: string; params?: object; }; effect?: { name?: string; type?: 'screen' | 'bubble'; }; idempotency_key?: string; parts?: { type: 'text'; value: string; mention?: string; mention_range?: number[]; text_decorations?: text_decoration[]; } | { type: 'media'; attachment_id?: string; url?: string; } | { type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; type: 'imessage_app'; fallback_text?: string; interactive?: boolean; url?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: { message_id: string; part_index?: number; }; }`\n  Message content container. Groups all message-related fields together,\nseparating the \"what\" (message content) from the \"where\" (routing fields like from/to).\n\nA message carries EITHER `parts` — text and attachments, which compose\ninto one bubble — or a single `action`, which invokes an experience\ninside Linq's iMessage app. Never both: an app card is the whole message\n(Apple's `MSMessage` cannot coexist with text), so copy and a card are\ntwo sends, not one.\n\n  - `action?: { action: string; experience: string; params?: object; }`\n    Invokes an action on an experience — a third party that renders inside\nLinq's iMessage app. Linq resolves the recipient's connection, mints any\nsession the action needs, composes the card and sends it; none of that\nis visible to you.\n\nCall `GET /v3/experiences/{experience}` for the actions you may invoke\nand the fields each accepts.\n\n  - `effect?: { name?: string; type?: 'screen' | 'bubble'; }`\n    iMessage effect to apply to this message (screen or bubble effect)\n  - `idempotency_key?: string`\n    Optional idempotency key for this message.\nUse this to prevent duplicate sends of the same message. Reusing a key\nwhose message was deleted — or was an ephemeral message that has since\nexpired — returns 404; the message is never resent.\n\n  - `parts?: { type: 'text'; value: string; mention?: string; mention_range?: number[]; text_decorations?: { range: number[]; animation?: 'big' | 'small' | 'shake' | 'nod' | 'explode' | 'ripple' | 'bloom' | 'jitter'; style?: 'bold' | 'italic' | 'strikethrough' | 'underline'; }[]; } | { type: 'media'; attachment_id?: string; url?: string; } | { type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; type: 'imessage_app'; fallback_text?: string; interactive?: boolean; url?: string; }[]`\n    Array of message parts. Each part can be text, media, or link.\nParts are displayed in order. Text and media can be mixed freely,\nbut a `link` part must be the only part in the message.\n\n**Rich Link Previews:**\n- Use a `link` part to send a URL with a rich preview card\n- A `link` part must be the **only** part in the message\n- To send a URL as plain text (no preview), use a `text` part instead\n\n**Supported Media:**\n- Images: .jpg, .jpeg, .png, .gif, .heic, .heif, .tif, .tiff, .bmp\n- Videos: .mp4, .mov, .m4v, .mpeg, .mpg, .3gp\n- Audio: .m4a, .mp3, .aac, .caf, .wav, .aiff, .amr\n- Documents: .pdf, .txt, .rtf, .csv, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pages, .numbers, .key, .epub, .zip, .html, .htm\n- Contact & Calendar: .vcf, .ics\n\n**Audio:**\n- Audio files (.m4a, .mp3, .aac, .caf, .wav, .aiff, .amr) are fully supported as media parts\n- To send audio as an **iMessage voice memo bubble** (inline playback UI), use the dedicated\n  `/v3/chats/{chatId}/voicememo` endpoint instead\n\n**Validation Rules:**\n- A `link` part must be the **only** part in the message. It cannot be combined\n  with text or media parts.\n- Consecutive text parts are not allowed. Text parts must be separated by\n  media parts. For example, [text, text] is invalid, but [text, media, text] is valid.\n- Maximum of **100 parts** total.\n- Media parts using a public `url` (downloaded by the server on send) are\n  capped at **40**. Parts using `attachment_id` or presigned URLs\n  are exempt from this sub-limit. For bulk media sends exceeding 40 files,\n  pre-upload via `POST /v3/attachments` and reference by `attachment_id` or `download_url`.\n\n  - `preferred_service?: 'iMessage' | 'SMS' | 'RCS'`\n    Messaging service type\n  - `reply_to?: { message_id: string; part_index?: number; }`\n    Reply to another message to create a threaded conversation\n\n- `to: string[]`\n  Recipient handles (E.164 phone numbers or email addresses). One handle\nis a direct chat; multiple handles a group chat. Order-independent — the\nset identifies the chat.\n\n\n- `continuation_message?: { text: string; }`\n  Text-only fallback that **replaces** `message` ONLY on the failover branch —\nwhen a chat with these recipients already existed but its line was flagged,\nso a new chat is created on a fresh line. On that branch this text is sent as\nthe single message instead of `message` (the recipient is on a new number, so\nyou typically want a fresh-number-appropriate opener rather than the original\ncontent). Ignored otherwise (a healthy reuse, or genuine first contact).\nCarries no parts, media, or effects — exactly one message is ever sent.\n\n  - `text: string`\n    The replacement message text, sent as the single message on failover.\n\n- `exclude_from?: string[]`\n  Lines (E.164) not to pick for this send. Applies for this request\nonly — nothing is remembered between calls.\n\n**Exclusion only affects picking a line for a new chat.** If `to`\nalready has a chat, that chat is reused on its own line, and a chat on\na non-excluded line is preferred when there is more than one. If the\nonly chat these recipients have is on an excluded line, it is still\nreused — an exclusion never abandons a live chat or moves it to a new\nnumber. Check `from` in the response to see the line that was actually\nused.\n\nNumbers that are not your lines are ignored. Every entry must be\nE.164 — a value like `4155551234` is rejected rather than silently\nskipped. Excluding every one of your available lines returns 400 when\na line has to be picked.\n\n\n- `override_optout?: boolean`\n  Send even though the recipient asked you to stop (`403`, error code\n`2024`). Applies to this request only: the opt-out stays in place, so\nthe next send without this flag is rejected again. Every override is\nrecorded against your API key.\n\n\n- `Idempotency-Key?: string`\n\n### Returns\n\n- `{ chat_id: string; created_new_chat: boolean; from: string; from_selection: { reason: 'reused_active_chat' | 'new_best_number' | 'failover_flagged'; reused_existing_chat: boolean; }; handles: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]; is_group: boolean; message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: text_part_response | media_part_response | link_part_response | object[]; sent_at: string; delivered_at?: string; effect?: message_effect; from_handle?: chat_handle; preferred_service?: service_type; reply_to?: reply_to; service?: service_type; }; service: 'iMessage' | 'SMS' | 'RCS'; previous_chat_id?: string; }`\n  Result of an auto-from send. Self-describing: which line was used, which\nchat the message landed in, whether a new chat was created, and the\nresulting message id(s).\n\n\n  - `chat_id: string`\n  - `created_new_chat: boolean`\n  - `from: string`\n  - `from_selection: { reason: 'reused_active_chat' | 'new_best_number' | 'failover_flagged'; reused_existing_chat: boolean; }`\n  - `handles: { id: string; handle: string; joined_at: string; service: 'iMessage' | 'SMS' | 'RCS'; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }[]`\n  - `is_group: boolean`\n  - `message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: { reactions: reaction[]; type: 'text'; value: string; text_decorations?: text_decoration[]; } | { id: string; filename: string; mime_type: string; reactions: reaction[]; size_bytes: number; type: 'media'; url: string; } | { reactions: reaction[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: object[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; sent_at: string; delivered_at?: string; effect?: { name?: string; type?: 'screen' | 'bubble'; }; from_handle?: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: { message_id: string; part_index?: number; }; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n  - `service: 'iMessage' | 'SMS' | 'RCS'`\n  - `previous_chat_id?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst message = await client.messages.create({\n  message: {},\n  to: ['+14155559876'],\n});\n\nconsole.log(message);\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.New',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tmessage, err := client.Messages.New(context.TODO(), linqgo.MessageNewParams{\n\t\tMessage: linqgo.MessageContentParam{\n\t\t\tParts: []linqgo.MessageContentPartUnionParam{{\n\t\t\t\tOfText: &linqgo.TextPartParam{\n\t\t\t\t\tType:  linqgo.TextPartTypeText,\n\t\t\t\t\tValue: "Hi! Thanks for reaching out — how can we help?",\n\t\t\t\t},\n\t\t\t}},\n\t\t},\n\t\tTo: []string{"+14155559876"},\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", message.ChatID)\n}\n',
      },
      python: {
        method: 'messages.create',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nmessage = client.messages.create(\n    message={\n        "parts": [{\n            "type": "text",\n            "value": "Hi! Thanks for reaching out — how can we help?",\n        }]\n    },\n    to=["+14155559876"],\n)\nprint(message.chat_id)',
      },
      typescript: {
        method: 'client.messages.create',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst message = await client.messages.create({\n  message: { parts: [{ type: 'text', value: 'Hi! Thanks for reaching out — how can we help?' }] },\n  to: ['+14155559876'],\n});\n\nconsole.log(message.chat_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "message": {\n            "parts": [\n              {\n                "type": "text",\n                "value": "Hi! Thanks for reaching out — how can we help?"\n              }\n            ]\n          },\n          "to": [\n            "+14155559876"\n          ],\n          "exclude_from": [\n            "+12052535597"\n          ],\n          "override_optout": false\n        }\'',
      },
    },
  },
  {
    name: 'list_messages_thread',
    endpoint: '/v3/messages/{messageId}/thread',
    httpMethod: 'get',
    summary: 'Get all messages in a thread',
    description:
      'Retrieve all messages in a conversation thread. Given any message ID in the thread,\nreturns the originator message and all replies in chronological order.\n\nIf the message is not part of a thread, returns just that single message.\n\nSupports pagination and configurable ordering.\n',
    stainlessPath: '(resource) messages > (method) list_messages_thread',
    qualified: 'client.messages.listMessagesThread',
    params: ['messageId: string;', 'cursor?: string;', 'limit?: number;', "order?: 'asc' | 'desc';"],
    response:
      "{ id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: object; from?: string; from_handle?: object; parts?: object | object | object | { app: object; layout: object; reactions: reaction[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; read_at?: string; reconciled_at?: string; reply_to?: object; sent_at?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }",
    markdown:
      "## list_messages_thread\n\n`client.messages.listMessagesThread(messageId: string, cursor?: string, limit?: number, order?: 'asc' | 'desc'): { id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: message_effect; from?: string; from_handle?: chat_handle; parts?: text_part_response | media_part_response | link_part_response | object[]; preferred_service?: service_type; read_at?: string; reconciled_at?: string; reply_to?: reply_to; sent_at?: string; service?: service_type; }`\n\n**get** `/v3/messages/{messageId}/thread`\n\nRetrieve all messages in a conversation thread. Given any message ID in the thread,\nreturns the originator message and all replies in chronological order.\n\nIf the message is not part of a thread, returns just that single message.\n\nSupports pagination and configurable ordering.\n\n\n### Parameters\n\n- `messageId: string`\n\n- `cursor?: string`\n  Pagination cursor from previous next_cursor response\n\n- `limit?: number`\n  Maximum number of messages to return\n\n- `order?: 'asc' | 'desc'`\n  Sort order for messages (asc = oldest first, desc = newest first)\n\n### Returns\n\n- `{ id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: { name?: string; type?: 'screen' | 'bubble'; }; from?: string; from_handle?: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; parts?: { reactions: reaction[]; type: 'text'; value: string; text_decorations?: text_decoration[]; } | { id: string; filename: string; mime_type: string; reactions: reaction[]; size_bytes: number; type: 'media'; url: string; } | { reactions: reaction[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: object[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; read_at?: string; reconciled_at?: string; reply_to?: { message_id: string; part_index?: number; }; sent_at?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n\n  - `id: string`\n  - `chat_id: string`\n  - `created_at: string`\n  - `delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'`\n  - `is_delivered: boolean`\n  - `is_from_me: boolean`\n  - `is_read: boolean`\n  - `updated_at: string`\n  - `delivered_at?: string`\n  - `effect?: { name?: string; type?: 'screen' | 'bubble'; }`\n  - `from?: string`\n  - `from_handle?: { id: string; handle: string; joined_at: string; service: 'iMessage' | 'SMS' | 'RCS'; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }`\n  - `parts?: { reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; type: 'text'; value: string; text_decorations?: { range: number[]; animation?: 'big' | 'small' | 'shake' | 'nod' | 'explode' | 'ripple' | 'bloom' | 'jitter'; style?: 'bold' | 'italic' | 'strikethrough' | 'underline'; }[]; } | { id: string; filename: string; mime_type: string; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; size_bytes: number; type: 'media'; url: string; } | { reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: { handle: object; is_me: boolean; type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker'; custom_emoji?: string; sticker?: { file_name?: string; height?: number; mime_type?: string; url?: string; width?: number; }; }[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]`\n  - `preferred_service?: 'iMessage' | 'SMS' | 'RCS'`\n  - `read_at?: string`\n  - `reconciled_at?: string`\n  - `reply_to?: { message_id: string; part_index?: number; }`\n  - `sent_at?: string`\n  - `service?: 'iMessage' | 'SMS' | 'RCS'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\n// Automatically fetches more pages as needed.\nfor await (const message of client.messages.listMessagesThread('69a37c7d-af4f-4b5e-af42-e28e98ce873a')) {\n  console.log(message);\n}\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.ListMessagesThread',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpage, err := client.Messages.ListMessagesThread(\n\t\tcontext.TODO(),\n\t\t"69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n\t\tlinqgo.MessageListMessagesThreadParams{},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", page)\n}\n',
      },
      python: {
        method: 'messages.list_messages_thread',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npage = client.messages.list_messages_thread(\n    message_id="69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n)\npage = page.messages[0]\nprint(page.id)',
      },
      typescript: {
        method: 'client.messages.listMessagesThread',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\n// Automatically fetches more pages as needed.\nfor await (const message of client.messages.listMessagesThread(\n  '69a37c7d-af4f-4b5e-af42-e28e98ce873a',\n)) {\n  console.log(message.id);\n}",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages/$MESSAGE_ID/thread \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/messages/{messageId}',
    httpMethod: 'get',
    summary: 'Get a message by ID',
    description:
      'Retrieve a specific message by its ID. This endpoint returns the full message\ndetails including text, attachments, reactions, and metadata.\n',
    stainlessPath: '(resource) messages > (method) retrieve',
    qualified: 'client.messages.retrieve',
    params: ['messageId: string;'],
    response:
      "{ id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: object; from?: string; from_handle?: object; parts?: object | object | object | { app: object; layout: object; reactions: reaction[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; read_at?: string; reconciled_at?: string; reply_to?: object; sent_at?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }",
    markdown:
      "## retrieve\n\n`client.messages.retrieve(messageId: string): { id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: message_effect; from?: string; from_handle?: chat_handle; parts?: text_part_response | media_part_response | link_part_response | object[]; preferred_service?: service_type; read_at?: string; reconciled_at?: string; reply_to?: reply_to; sent_at?: string; service?: service_type; }`\n\n**get** `/v3/messages/{messageId}`\n\nRetrieve a specific message by its ID. This endpoint returns the full message\ndetails including text, attachments, reactions, and metadata.\n\n\n### Parameters\n\n- `messageId: string`\n\n### Returns\n\n- `{ id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: { name?: string; type?: 'screen' | 'bubble'; }; from?: string; from_handle?: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; parts?: { reactions: reaction[]; type: 'text'; value: string; text_decorations?: text_decoration[]; } | { id: string; filename: string; mime_type: string; reactions: reaction[]; size_bytes: number; type: 'media'; url: string; } | { reactions: reaction[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: object[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; read_at?: string; reconciled_at?: string; reply_to?: { message_id: string; part_index?: number; }; sent_at?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n\n  - `id: string`\n  - `chat_id: string`\n  - `created_at: string`\n  - `delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'`\n  - `is_delivered: boolean`\n  - `is_from_me: boolean`\n  - `is_read: boolean`\n  - `updated_at: string`\n  - `delivered_at?: string`\n  - `effect?: { name?: string; type?: 'screen' | 'bubble'; }`\n  - `from?: string`\n  - `from_handle?: { id: string; handle: string; joined_at: string; service: 'iMessage' | 'SMS' | 'RCS'; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }`\n  - `parts?: { reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; type: 'text'; value: string; text_decorations?: { range: number[]; animation?: 'big' | 'small' | 'shake' | 'nod' | 'explode' | 'ripple' | 'bloom' | 'jitter'; style?: 'bold' | 'italic' | 'strikethrough' | 'underline'; }[]; } | { id: string; filename: string; mime_type: string; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; size_bytes: number; type: 'media'; url: string; } | { reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: { handle: object; is_me: boolean; type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker'; custom_emoji?: string; sticker?: { file_name?: string; height?: number; mime_type?: string; url?: string; width?: number; }; }[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]`\n  - `preferred_service?: 'iMessage' | 'SMS' | 'RCS'`\n  - `read_at?: string`\n  - `reconciled_at?: string`\n  - `reply_to?: { message_id: string; part_index?: number; }`\n  - `sent_at?: string`\n  - `service?: 'iMessage' | 'SMS' | 'RCS'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst message = await client.messages.retrieve('69a37c7d-af4f-4b5e-af42-e28e98ce873a');\n\nconsole.log(message);\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tmessage, err := client.Messages.Get(context.TODO(), "69a37c7d-af4f-4b5e-af42-e28e98ce873a")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", message.ID)\n}\n',
      },
      python: {
        method: 'messages.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nmessage = client.messages.retrieve(\n    "69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n)\nprint(message.id)',
      },
      typescript: {
        method: 'client.messages.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst message = await client.messages.retrieve('69a37c7d-af4f-4b5e-af42-e28e98ce873a');\n\nconsole.log(message.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages/$MESSAGE_ID \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'delete',
    endpoint: '/v3/messages/{messageId}',
    httpMethod: 'delete',
    summary: 'Delete a message from system',
    description:
      "Deletes a message from the Linq API only. This does NOT unsend or remove the message\nfrom the actual chat — recipients will still see the message.\nRe-sending with a deleted message's idempotency key returns 404 — a deleted message is never resent.\n",
    stainlessPath: '(resource) messages > (method) delete',
    qualified: 'client.messages.delete',
    params: ['messageId: string;'],
    markdown:
      "## delete\n\n`client.messages.delete(messageId: string): void`\n\n**delete** `/v3/messages/{messageId}`\n\nDeletes a message from the Linq API only. This does NOT unsend or remove the message\nfrom the actual chat — recipients will still see the message.\nRe-sending with a deleted message's idempotency key returns 404 — a deleted message is never resent.\n\n\n### Parameters\n\n- `messageId: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nawait client.messages.delete('69a37c7d-af4f-4b5e-af42-e28e98ce873a')\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.Delete',
        example:
          'package main\n\nimport (\n\t"context"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\terr := client.Messages.Delete(context.TODO(), "69a37c7d-af4f-4b5e-af42-e28e98ce873a")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n}\n',
      },
      python: {
        method: 'messages.delete',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nclient.messages.delete(\n    "69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n)',
      },
      typescript: {
        method: 'client.messages.delete',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.messages.delete('69a37c7d-af4f-4b5e-af42-e28e98ce873a');",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages/$MESSAGE_ID \\\n    -X DELETE \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'add_reaction',
    endpoint: '/v3/messages/{messageId}/reactions',
    httpMethod: 'post',
    summary: 'Add or remove a reaction to a message',
    description:
      'Add or remove emoji reactions to messages. Reactions let users express\ntheir response to a message without sending a new message.\n\n**Supported Reactions:**\n- love ❤️\n- like 👍\n- dislike 👎\n- laugh 😂\n- emphasize ‼️\n- question ❓\n- custom - any emoji (use `custom_emoji` field to specify)\n',
    stainlessPath: '(resource) messages > (method) add_reaction',
    qualified: 'client.messages.addReaction',
    params: [
      'messageId: string;',
      "operation: 'add' | 'remove';",
      "type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker';",
      'custom_emoji?: string;',
      'part_index?: number;',
    ],
    response: '{ message?: string; status?: string; trace_id?: string; }',
    markdown:
      "## add_reaction\n\n`client.messages.addReaction(messageId: string, operation: 'add' | 'remove', type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker', custom_emoji?: string, part_index?: number): { message?: string; status?: string; trace_id?: string; }`\n\n**post** `/v3/messages/{messageId}/reactions`\n\nAdd or remove emoji reactions to messages. Reactions let users express\ntheir response to a message without sending a new message.\n\n**Supported Reactions:**\n- love ❤️\n- like 👍\n- dislike 👎\n- laugh 😂\n- emphasize ‼️\n- question ❓\n- custom - any emoji (use `custom_emoji` field to specify)\n\n\n### Parameters\n\n- `messageId: string`\n\n- `operation: 'add' | 'remove'`\n  Whether to add or remove the reaction\n\n- `type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker'`\n  Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh, emphasize, question.\nCustom emoji reactions have type \"custom\" with the actual emoji in the custom_emoji field.\nSticker reactions have type \"sticker\" with sticker attachment details in the sticker field.\n\n\n- `custom_emoji?: string`\n  Custom emoji string. Required when type is \"custom\".\n\n\n- `part_index?: number`\n  Optional index of the message part to react to.\nIf not provided, reacts to the entire message (part 0).\n\n\n### Returns\n\n- `{ message?: string; status?: string; trace_id?: string; }`\n\n  - `message?: string`\n  - `status?: string`\n  - `trace_id?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst response = await client.messages.addReaction('69a37c7d-af4f-4b5e-af42-e28e98ce873a', { operation: 'add', type: 'love' });\n\nconsole.log(response);\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.AddReaction',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n\t"github.com/linq-team/linq-go/shared"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tresponse, err := client.Messages.AddReaction(\n\t\tcontext.TODO(),\n\t\t"69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n\t\tlinqgo.MessageAddReactionParams{\n\t\t\tOperation: linqgo.MessageAddReactionParamsOperationAdd,\n\t\t\tType:      shared.ReactionTypeLove,\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", response.TraceID)\n}\n',
      },
      python: {
        method: 'messages.add_reaction',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.messages.add_reaction(\n    message_id="69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n    operation="add",\n    type="love",\n)\nprint(response.trace_id)',
      },
      typescript: {
        method: 'client.messages.addReaction',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.messages.addReaction('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {\n  operation: 'add',\n  type: 'love',\n});\n\nconsole.log(response.trace_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages/$MESSAGE_ID/reactions \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "operation": "add",\n          "type": "love",\n          "part_index": 1\n        }\'',
      },
    },
  },
  {
    name: 'update',
    endpoint: '/v3/messages/{messageId}',
    httpMethod: 'patch',
    summary: 'Edit the content of a message part',
    description:
      'Edit the text content of a specific part of a previously sent message.\n\n**Note:** A message can be edited up to 5 times, and only within 15 minutes of when it was originally sent.\n',
    stainlessPath: '(resource) messages > (method) update',
    qualified: 'client.messages.update',
    params: ['messageId: string;', 'text: string;', 'part_index?: number;'],
    response:
      "{ id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: object; from?: string; from_handle?: object; parts?: object | object | object | { app: object; layout: object; reactions: reaction[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; read_at?: string; reconciled_at?: string; reply_to?: object; sent_at?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }",
    markdown:
      "## update\n\n`client.messages.update(messageId: string, text: string, part_index?: number): { id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: message_effect; from?: string; from_handle?: chat_handle; parts?: text_part_response | media_part_response | link_part_response | object[]; preferred_service?: service_type; read_at?: string; reconciled_at?: string; reply_to?: reply_to; sent_at?: string; service?: service_type; }`\n\n**patch** `/v3/messages/{messageId}`\n\nEdit the text content of a specific part of a previously sent message.\n\n**Note:** A message can be edited up to 5 times, and only within 15 minutes of when it was originally sent.\n\n\n### Parameters\n\n- `messageId: string`\n\n- `text: string`\n  New text content for the message part\n\n- `part_index?: number`\n  Index of the message part to edit. Defaults to 0.\n\n### Returns\n\n- `{ id: string; chat_id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_delivered: boolean; is_from_me: boolean; is_read: boolean; updated_at: string; delivered_at?: string; effect?: { name?: string; type?: 'screen' | 'bubble'; }; from?: string; from_handle?: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; parts?: { reactions: reaction[]; type: 'text'; value: string; text_decorations?: text_decoration[]; } | { id: string; filename: string; mime_type: string; reactions: reaction[]; size_bytes: number; type: 'media'; url: string; } | { reactions: reaction[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: object[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; read_at?: string; reconciled_at?: string; reply_to?: { message_id: string; part_index?: number; }; sent_at?: string; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n\n  - `id: string`\n  - `chat_id: string`\n  - `created_at: string`\n  - `delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'`\n  - `is_delivered: boolean`\n  - `is_from_me: boolean`\n  - `is_read: boolean`\n  - `updated_at: string`\n  - `delivered_at?: string`\n  - `effect?: { name?: string; type?: 'screen' | 'bubble'; }`\n  - `from?: string`\n  - `from_handle?: { id: string; handle: string; joined_at: string; service: 'iMessage' | 'SMS' | 'RCS'; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }`\n  - `parts?: { reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; type: 'text'; value: string; text_decorations?: { range: number[]; animation?: 'big' | 'small' | 'shake' | 'nod' | 'explode' | 'ripple' | 'bloom' | 'jitter'; style?: 'bold' | 'italic' | 'strikethrough' | 'underline'; }[]; } | { id: string; filename: string; mime_type: string; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; size_bytes: number; type: 'media'; url: string; } | { reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: { handle: object; is_me: boolean; type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker'; custom_emoji?: string; sticker?: { file_name?: string; height?: number; mime_type?: string; url?: string; width?: number; }; }[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]`\n  - `preferred_service?: 'iMessage' | 'SMS' | 'RCS'`\n  - `read_at?: string`\n  - `reconciled_at?: string`\n  - `reply_to?: { message_id: string; part_index?: number; }`\n  - `sent_at?: string`\n  - `service?: 'iMessage' | 'SMS' | 'RCS'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst message = await client.messages.update('69a37c7d-af4f-4b5e-af42-e28e98ce873a', { text: 'This is the edited message content' });\n\nconsole.log(message);\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.Update',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tmessage, err := client.Messages.Update(\n\t\tcontext.TODO(),\n\t\t"69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n\t\tlinqgo.MessageUpdateParams{\n\t\t\tText: "This is the edited message content",\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", message.ID)\n}\n',
      },
      python: {
        method: 'messages.update',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nmessage = client.messages.update(\n    message_id="69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n    text="This is the edited message content",\n    part_index=0,\n)\nprint(message.id)',
      },
      typescript: {
        method: 'client.messages.update',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst message = await client.messages.update('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {\n  text: 'This is the edited message content',\n});\n\nconsole.log(message.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages/$MESSAGE_ID \\\n    -X PATCH \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "text": "This is the edited message content",\n          "part_index": 0\n        }\'',
      },
    },
  },
  {
    name: 'update_app_card',
    endpoint: '/v3/messages/{messageId}/update',
    httpMethod: 'post',
    summary: 'Update an iMessage app card in place',
    description:
      "Replaces a previously delivered `imessage_app` card on the recipient's screen with new\ncontent, instead of posting a new bubble (like a game move redrawing the board).\n\nThe update is delivered as a **new message** with its own id and delivery lifecycle\n(`message.sent` / `message.delivered` / `message.failed` webhooks fire for the new id).\nTo update the card again, reference the message id returned by this call.\n\nConstraints:\n- The referenced message must be an `imessage_app` card sent by you (`400` otherwise —\n  inbound cards cannot be updated).\n- The referenced card must already be delivered (`409` otherwise — retry after the\n  `message.delivered` webhook for it).\n- The app identity (`team_id`, `bundle_id`, name) is inherited from the original card and\n  cannot change; only `url`, `fallback_text`, and `layout` are replaced.\n- iMessage-only, like all app cards.\n- Concurrent updates against the same card are not serialized server-side; the last one\n  delivered wins on the recipient's screen. Serialize updates by always referencing the\n  message id returned by the previous call.\n",
    stainlessPath: '(resource) messages > (method) update_app_card',
    qualified: 'client.messages.updateAppCard',
    params: [
      'messageId: string;',
      'layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; };',
      'action?: { action: string; experience: string; params?: object; };',
      'fallback_text?: string;',
      'interactive?: boolean;',
      'url?: string;',
    ],
    response:
      "{ chat_id: string; message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: text_part_response | media_part_response | link_part_response | object[]; sent_at: string; delivered_at?: string; effect?: message_effect; from_handle?: chat_handle; preferred_service?: service_type; reply_to?: reply_to; service?: service_type; }; }",
    markdown:
      "## update_app_card\n\n`client.messages.updateAppCard(messageId: string, layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }, action?: { action: string; experience: string; params?: object; }, fallback_text?: string, interactive?: boolean, url?: string): { chat_id: string; message: sent_message; }`\n\n**post** `/v3/messages/{messageId}/update`\n\nReplaces a previously delivered `imessage_app` card on the recipient's screen with new\ncontent, instead of posting a new bubble (like a game move redrawing the board).\n\nThe update is delivered as a **new message** with its own id and delivery lifecycle\n(`message.sent` / `message.delivered` / `message.failed` webhooks fire for the new id).\nTo update the card again, reference the message id returned by this call.\n\nConstraints:\n- The referenced message must be an `imessage_app` card sent by you (`400` otherwise —\n  inbound cards cannot be updated).\n- The referenced card must already be delivered (`409` otherwise — retry after the\n  `message.delivered` webhook for it).\n- The app identity (`team_id`, `bundle_id`, name) is inherited from the original card and\n  cannot change; only `url`, `fallback_text`, and `layout` are replaced.\n- iMessage-only, like all app cards.\n- Concurrent updates against the same card are not serialized server-side; the last one\n  delivered wins on the recipient's screen. Serialize updates by always referencing the\n  message id returned by the previous call.\n\n\n### Parameters\n\n- `messageId: string`\n\n- `layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }`\n  Visible layout of the card. At least one of\n`caption`, `subcaption`, `trailing_caption`, `trailing_subcaption`, or `image_url` must be\nset, otherwise the card renders as an empty bubble.\n\n`image_url` displays a preview image at the top of the card. The image renders on the\nrecipient's card whether or not they have your app installed. The small icon beside the\ncaption is the app's own icon and is not settable here.\n\n`* Note - requires a trusted chat w/ inbound activity`\n\n`image_title` and `image_subtitle` render as text overlaid on the image (title bold, subtitle\nbeneath it). They only appear when `image_url` is set — without an image there is nothing to\noverlay — so setting either without `image_url` is rejected.\n\n  - `caption?: string`\n    Primary label, top-left and bold.\n  - `image_subtitle?: string`\n    Text shown below `image_title`, overlaid on the card image. Requires `image_url`.\n  - `image_title?: string`\n    Bold text overlaid on the card image. Requires `image_url` (rejected without it).\n  - `image_url?: string`\n    URL of an image (JPEG, PNG, HEIF, or WebP) to display as the card's preview image; an unreachable or non-image URL returns a validation error. Renders for all recipients regardless of whether they have the app. Note - requires a trusted chat w/ inbound activity. In responses, this is the re-hosted `cdn.linqapp.com` copy of the image you supplied, not your original URL.\n  - `subcaption?: string`\n    Secondary label, below `caption` on the left.\n  - `trailing_caption?: string`\n    Label shown top-right.\n  - `trailing_subcaption?: string`\n    Label shown below `trailing_caption`, on the right.\n\n- `action?: { action: string; experience: string; params?: object; }`\n  Invokes an action on an experience — a third party that renders inside\nLinq's iMessage app. Linq resolves the recipient's connection, mints any\nsession the action needs, composes the card and sends it; none of that\nis visible to you.\n\nCall `GET /v3/experiences/{experience}` for the actions you may invoke\nand the fields each accepts.\n\n  - `action: string`\n    Which of its actions, e.g. `attach_card`.\n  - `experience: string`\n    The experience to invoke, e.g. `agentcard`.\n  - `params?: object`\n    Values for the fields this action exposes. Keys are exactly the\nfield names listed for the action — no mapping, no nesting.\n\nDisplay copy only, except a `url`-type field — that value sets the\ndestination, and must be an absolute `https` URL.\n\n\n- `fallback_text?: string`\n  Text shown on surfaces that cannot render the card (notifications, lock screen). Defaults\nto the caption when omitted.\n\n\n- `interactive?: boolean`\n  Whether the updated card renders as your app's interactive balloon for recipients who\nhave your iMessage app installed. `true` (default) lets your installed extension draw its\nlive view; `false` always shows the static `layout` card. Recipients without your app\nalways see the static card regardless of this flag.\n\nDefaults to `true` when omitted — it is **not** inherited from the original card. To keep a\ncard static across updates, re-send `interactive: false` on each update.\n\n\n- `url?: string`\n  URL the recipient's app opens when they tap the updated card.\n\nMutually exclusive with `action` and `raw_payload_data`.\n\n\n### Returns\n\n- `{ chat_id: string; message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: text_part_response | media_part_response | link_part_response | object[]; sent_at: string; delivered_at?: string; effect?: message_effect; from_handle?: chat_handle; preferred_service?: service_type; reply_to?: reply_to; service?: service_type; }; }`\n  Response for sending a message to a chat\n\n  - `chat_id: string`\n  - `message: { id: string; created_at: string; delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed'; is_read: boolean; parts: { reactions: reaction[]; type: 'text'; value: string; text_decorations?: text_decoration[]; } | { id: string; filename: string; mime_type: string; reactions: reaction[]; size_bytes: number; type: 'media'; url: string; } | { reactions: reaction[]; type: 'link'; value: string; } | { app: { bundle_id: string; name: string; team_id: string; app_store_id?: number; }; layout: { caption?: string; image_subtitle?: string; image_title?: string; image_url?: string; subcaption?: string; trailing_caption?: string; trailing_subcaption?: string; }; reactions: object[]; type: 'imessage_app'; url: string; fallback_text?: string; }[]; sent_at: string; delivered_at?: string; effect?: { name?: string; type?: 'screen' | 'bubble'; }; from_handle?: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; preferred_service?: 'iMessage' | 'SMS' | 'RCS'; reply_to?: { message_id: string; part_index?: number; }; service?: 'iMessage' | 'SMS' | 'RCS'; }`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst response = await client.messages.updateAppCard('69a37c7d-af4f-4b5e-af42-e28e98ce873a', { layout: {} });\n\nconsole.log(response);\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.UpdateAppCard',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tresponse, err := client.Messages.UpdateAppCard(\n\t\tcontext.TODO(),\n\t\t"69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n\t\tlinqgo.MessageUpdateAppCardParams{\n\t\t\tLayout: linqgo.MessageUpdateAppCardParamsLayout{\n\t\t\t\tCaption: linqgo.String("Score: 2 – 1"),\n\t\t\t},\n\t\t\tFallbackText: linqgo.String("Score update"),\n\t\t\tURL:          linqgo.String("https://app.example.com/card?game=7f3a&move=2"),\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", response.ChatID)\n}\n',
      },
      python: {
        method: 'messages.update_app_card',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.messages.update_app_card(\n    message_id="69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n    layout={\n        "caption": "Score: 2 – 1"\n    },\n    fallback_text="Score update",\n    url="https://app.example.com/card?game=7f3a&move=2",\n)\nprint(response.chat_id)',
      },
      typescript: {
        method: 'client.messages.updateAppCard',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.messages.updateAppCard('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {\n  layout: { caption: 'Score: 2 – 1' },\n  fallback_text: 'Score update',\n  url: 'https://app.example.com/card?game=7f3a&move=2',\n});\n\nconsole.log(response.chat_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages/$MESSAGE_ID/update \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "layout": {\n            "caption": "Score: 2 – 1"\n          },\n          "fallback_text": "Score update",\n          "interactive": true,\n          "url": "https://app.example.com/card?game=7f3a&move=2"\n        }\'',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/messages/{messageId}/poll',
    httpMethod: 'get',
    summary: "Get a poll's current tally",
    description:
      "Return a poll's current results — its options, each option's voters, and the distinct\ntotal number of voters — by the poll-definition message's ID.\n",
    stainlessPath: '(resource) messages.poll > (method) retrieve',
    qualified: 'client.messages.poll.retrieve',
    params: ['messageId: string;'],
    response:
      '{ chat_id: string; created_at: string; message_id: string; poll: { options: object[]; total_voters: number; }; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; updated_at: string; }',
    markdown:
      "## retrieve\n\n`client.messages.poll.retrieve(messageId: string): { chat_id: string; created_at: string; message_id: string; poll: poll; reactions: reaction[]; updated_at: string; }`\n\n**get** `/v3/messages/{messageId}/poll`\n\nReturn a poll's current results — its options, each option's voters, and the distinct\ntotal number of voters — by the poll-definition message's ID.\n\n\n### Parameters\n\n- `messageId: string`\n\n### Returns\n\n- `{ chat_id: string; created_at: string; message_id: string; poll: { options: object[]; total_voters: number; }; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; updated_at: string; }`\n  Message-level envelope returned by every poll endpoint.\n\n  - `chat_id: string`\n  - `created_at: string`\n  - `message_id: string`\n  - `poll: { options: { can_be_edited: boolean; creator_handle: object; option_id: string; text: string; voters: { handle: string; voted_at: string; }[]; }[]; total_voters: number; }`\n  - `reactions: { handle: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; is_me: boolean; type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker'; custom_emoji?: string; sticker?: { file_name?: string; height?: number; mime_type?: string; url?: string; width?: number; }; }[]`\n  - `updated_at: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst pollEnvelope = await client.messages.poll.retrieve('69a37c7d-af4f-4b5e-af42-e28e98ce873a');\n\nconsole.log(pollEnvelope);\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.Poll.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpollEnvelope, err := client.Messages.Poll.Get(context.TODO(), "69a37c7d-af4f-4b5e-af42-e28e98ce873a")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", pollEnvelope.ChatID)\n}\n',
      },
      python: {
        method: 'messages.poll.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npoll_envelope = client.messages.poll.retrieve(\n    "69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n)\nprint(poll_envelope.chat_id)',
      },
      typescript: {
        method: 'client.messages.poll.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst pollEnvelope = await client.messages.poll.retrieve('69a37c7d-af4f-4b5e-af42-e28e98ce873a');\n\nconsole.log(pollEnvelope.chat_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages/$MESSAGE_ID/poll \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'add_options',
    endpoint: '/v3/messages/{messageId}/poll/options',
    httpMethod: 'post',
    summary: 'Add options to a poll',
    description:
      'Add one or more options to an existing poll. Options are **add-only and immutable** — you\ncan append options but never edit or remove them (Apple constraint). Returns the full poll.\n',
    stainlessPath: '(resource) messages.poll > (method) add_options',
    qualified: 'client.messages.poll.addOptions',
    params: ['messageId: string;', 'options: { text: string; }[];'],
    response:
      '{ chat_id: string; created_at: string; message_id: string; poll: { options: object[]; total_voters: number; }; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; updated_at: string; }',
    markdown:
      "## add_options\n\n`client.messages.poll.addOptions(messageId: string, options: { text: string; }[]): { chat_id: string; created_at: string; message_id: string; poll: poll; reactions: reaction[]; updated_at: string; }`\n\n**post** `/v3/messages/{messageId}/poll/options`\n\nAdd one or more options to an existing poll. Options are **add-only and immutable** — you\ncan append options but never edit or remove them (Apple constraint). Returns the full poll.\n\n\n### Parameters\n\n- `messageId: string`\n\n- `options: { text: string; }[]`\n\n### Returns\n\n- `{ chat_id: string; created_at: string; message_id: string; poll: { options: object[]; total_voters: number; }; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; updated_at: string; }`\n  Message-level envelope returned by every poll endpoint.\n\n  - `chat_id: string`\n  - `created_at: string`\n  - `message_id: string`\n  - `poll: { options: { can_be_edited: boolean; creator_handle: object; option_id: string; text: string; voters: { handle: string; voted_at: string; }[]; }[]; total_voters: number; }`\n  - `reactions: { handle: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; is_me: boolean; type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker'; custom_emoji?: string; sticker?: { file_name?: string; height?: number; mime_type?: string; url?: string; width?: number; }; }[]`\n  - `updated_at: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst pollEnvelope = await client.messages.poll.addOptions('69a37c7d-af4f-4b5e-af42-e28e98ce873a', { options: [{ text: 'Pizza' }] });\n\nconsole.log(pollEnvelope);\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.Poll.AddOptions',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpollEnvelope, err := client.Messages.Poll.AddOptions(\n\t\tcontext.TODO(),\n\t\t"69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n\t\tlinqgo.MessagePollAddOptionsParams{\n\t\t\tOptions: []linqgo.MessagePollAddOptionsParamsOption{{\n\t\t\t\tText: "Pizza",\n\t\t\t}},\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", pollEnvelope.ChatID)\n}\n',
      },
      python: {
        method: 'messages.poll.add_options',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npoll_envelope = client.messages.poll.add_options(\n    message_id="69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n    options=[{\n        "text": "Pizza"\n    }],\n)\nprint(poll_envelope.chat_id)',
      },
      typescript: {
        method: 'client.messages.poll.addOptions',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst pollEnvelope = await client.messages.poll.addOptions('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {\n  options: [{ text: 'Pizza' }],\n});\n\nconsole.log(pollEnvelope.chat_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages/$MESSAGE_ID/poll/options \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "options": [\n            {\n              "text": "Pizza"\n            }\n          ]\n        }\'',
      },
    },
  },
  {
    name: 'vote',
    endpoint: '/v3/messages/{messageId}/poll/votes',
    httpMethod: 'post',
    summary: 'Toggle a vote on a poll option',
    description:
      "Add or remove your line's vote on **one** poll option (per-option toggle — iMessage polls\nare toggled one option at a time). Returns the poll reflecting the toggle.\n",
    stainlessPath: '(resource) messages.poll > (method) vote',
    qualified: 'client.messages.poll.vote',
    params: ['messageId: string;', "operation: 'add' | 'remove';", 'option_id: string;'],
    response:
      '{ chat_id: string; created_at: string; message_id: string; poll: { options: object[]; total_voters: number; }; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; updated_at: string; }',
    markdown:
      "## vote\n\n`client.messages.poll.vote(messageId: string, operation: 'add' | 'remove', option_id: string): { chat_id: string; created_at: string; message_id: string; poll: poll; reactions: reaction[]; updated_at: string; }`\n\n**post** `/v3/messages/{messageId}/poll/votes`\n\nAdd or remove your line's vote on **one** poll option (per-option toggle — iMessage polls\nare toggled one option at a time). Returns the poll reflecting the toggle.\n\n\n### Parameters\n\n- `messageId: string`\n\n- `operation: 'add' | 'remove'`\n  Add or remove your line's vote on the option.\n\n- `option_id: string`\n  The option to toggle a vote on.\n\n### Returns\n\n- `{ chat_id: string; created_at: string; message_id: string; poll: { options: object[]; total_voters: number; }; reactions: { handle: chat_handle; is_me: boolean; type: reaction_type; custom_emoji?: string; sticker?: object; }[]; updated_at: string; }`\n  Message-level envelope returned by every poll endpoint.\n\n  - `chat_id: string`\n  - `created_at: string`\n  - `message_id: string`\n  - `poll: { options: { can_be_edited: boolean; creator_handle: object; option_id: string; text: string; voters: { handle: string; voted_at: string; }[]; }[]; total_voters: number; }`\n  - `reactions: { handle: { id: string; handle: string; joined_at: string; service: service_type; is_me?: boolean; left_at?: string; status?: 'active' | 'left' | 'removed'; }; is_me: boolean; type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom' | 'sticker'; custom_emoji?: string; sticker?: { file_name?: string; height?: number; mime_type?: string; url?: string; width?: number; }; }[]`\n  - `updated_at: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst pollEnvelope = await client.messages.poll.vote('69a37c7d-af4f-4b5e-af42-e28e98ce873a', { operation: 'add', option_id: '97ce8c17-7ef6-4bbc-a89a-6b93d189712f' });\n\nconsole.log(pollEnvelope);\n```",
    perLanguage: {
      go: {
        method: 'client.Messages.Poll.Vote',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpollEnvelope, err := client.Messages.Poll.Vote(\n\t\tcontext.TODO(),\n\t\t"69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n\t\tlinqgo.MessagePollVoteParams{\n\t\t\tOperation: linqgo.MessagePollVoteParamsOperationAdd,\n\t\t\tOptionID:  "97ce8c17-7ef6-4bbc-a89a-6b93d189712f",\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", pollEnvelope.ChatID)\n}\n',
      },
      python: {
        method: 'messages.poll.vote',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npoll_envelope = client.messages.poll.vote(\n    message_id="69a37c7d-af4f-4b5e-af42-e28e98ce873a",\n    operation="add",\n    option_id="97ce8c17-7ef6-4bbc-a89a-6b93d189712f",\n)\nprint(poll_envelope.chat_id)',
      },
      typescript: {
        method: 'client.messages.poll.vote',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst pollEnvelope = await client.messages.poll.vote('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {\n  operation: 'add',\n  option_id: '97ce8c17-7ef6-4bbc-a89a-6b93d189712f',\n});\n\nconsole.log(pollEnvelope.chat_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/messages/$MESSAGE_ID/poll/votes \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "operation": "add",\n          "option_id": "97ce8c17-7ef6-4bbc-a89a-6b93d189712f"\n        }\'',
      },
    },
  },
  {
    name: 'create',
    endpoint: '/v3/attachments',
    httpMethod: 'post',
    summary: 'Pre-upload a file',
    description:
      '**This endpoint is optional.** You can send media by simply providing a URL in your\nmessage\'s media part — no pre-upload required. Use this endpoint only when you want\nto upload a file ahead of time for reuse or latency optimization.\n\nReturns a presigned upload URL and a permanent `attachment_id` you can reference\nin future messages.\n\n## Step 1: Request an upload URL\n\nCall this endpoint with file metadata:\n\n```json\nPOST /v3/attachments\n{\n  "filename": "photo.jpg",\n  "content_type": "image/jpeg",\n  "size_bytes": 1024000\n}\n```\n\nThe response includes an `upload_url` (valid for 15 minutes) and a permanent `attachment_id`.\n\n## Step 2: Upload the file\n\nMake a PUT request to the `upload_url` with the raw file bytes as the request body.\nYou **must** include all headers from `required_headers` exactly as returned — the presigned URL\nis signed with these values and S3 will reject the upload if they don\'t match.\n\nThe request body is the binary file content — **not** JSON, **not** multipart form data.\nThe file must equal `size_bytes` bytes (the value you declared in step 1).\n\n```bash\ncurl -X PUT "<upload_url from step 1>" \\\n  -H "Content-Type: image/jpeg" \\\n  -H "Content-Length: 1024000" \\\n  --data-binary @photo.jpg\n```\n\n## Step 3: Send a message with the attachment\n\nReference the `attachment_id` in a media part. The ID never expires — use it in as many messages as you want.\n\n```json\nPOST /v3/chats\n{\n  "from": "+15559876543",\n  "to": ["+15551234567"],\n  "message": {\n    "parts": [\n      { "type": "media", "attachment_id": "<attachment_id from step 1>" }\n    ]\n  }\n}\n```\n\n## When to use this instead of a URL in the media part\n\n- Sending the same file to multiple recipients (avoids re-downloading each time)\n- Large files where you want to separate upload from message send\n- Latency-sensitive sends where the file should already be stored\n\nIf you just need to send a file once, skip all of this and pass a `url` directly in the media part instead.\n\n**File Size Limit:** 100MB\n\n**Unsupported Types:** WebP, SVG, FLAC, OGG, and executable files are explicitly rejected.\n',
    stainlessPath: '(resource) attachments > (method) create',
    qualified: 'client.attachments.create',
    params: ['content_type: string;', 'filename: string;', 'size_bytes: number;'],
    response:
      "{ attachment_id: string; download_url: string; expires_at: string; http_method: 'PUT'; required_headers: object; upload_url: string; }",
    markdown:
      '## create\n\n`client.attachments.create(content_type: string, filename: string, size_bytes: number): { attachment_id: string; download_url: string; expires_at: string; http_method: \'PUT\'; required_headers: object; upload_url: string; }`\n\n**post** `/v3/attachments`\n\n**This endpoint is optional.** You can send media by simply providing a URL in your\nmessage\'s media part — no pre-upload required. Use this endpoint only when you want\nto upload a file ahead of time for reuse or latency optimization.\n\nReturns a presigned upload URL and a permanent `attachment_id` you can reference\nin future messages.\n\n## Step 1: Request an upload URL\n\nCall this endpoint with file metadata:\n\n```json\nPOST /v3/attachments\n{\n  "filename": "photo.jpg",\n  "content_type": "image/jpeg",\n  "size_bytes": 1024000\n}\n```\n\nThe response includes an `upload_url` (valid for 15 minutes) and a permanent `attachment_id`.\n\n## Step 2: Upload the file\n\nMake a PUT request to the `upload_url` with the raw file bytes as the request body.\nYou **must** include all headers from `required_headers` exactly as returned — the presigned URL\nis signed with these values and S3 will reject the upload if they don\'t match.\n\nThe request body is the binary file content — **not** JSON, **not** multipart form data.\nThe file must equal `size_bytes` bytes (the value you declared in step 1).\n\n```bash\ncurl -X PUT "<upload_url from step 1>" \\\n  -H "Content-Type: image/jpeg" \\\n  -H "Content-Length: 1024000" \\\n  --data-binary @photo.jpg\n```\n\n## Step 3: Send a message with the attachment\n\nReference the `attachment_id` in a media part. The ID never expires — use it in as many messages as you want.\n\n```json\nPOST /v3/chats\n{\n  "from": "+15559876543",\n  "to": ["+15551234567"],\n  "message": {\n    "parts": [\n      { "type": "media", "attachment_id": "<attachment_id from step 1>" }\n    ]\n  }\n}\n```\n\n## When to use this instead of a URL in the media part\n\n- Sending the same file to multiple recipients (avoids re-downloading each time)\n- Large files where you want to separate upload from message send\n- Latency-sensitive sends where the file should already be stored\n\nIf you just need to send a file once, skip all of this and pass a `url` directly in the media part instead.\n\n**File Size Limit:** 100MB\n\n**Unsupported Types:** WebP, SVG, FLAC, OGG, and executable files are explicitly rejected.\n\n\n### Parameters\n\n- `content_type: string`\n  Supported MIME types for file attachments and media URLs.\n\n**Images:** image/jpeg, image/png, image/gif, image/heic, image/heif, image/tiff, image/bmp, image/svg+xml, image/webp, image/x-icon\n\n**Videos:** video/mp4, video/quicktime, video/mpeg, video/mpeg2, video/x-msvideo, video/3gpp\n\n**Audio:** audio/mpeg, audio/x-m4a, audio/x-caf, audio/x-wav, audio/x-aiff, audio/aac, audio/midi, audio/amr\n\n**Wallet passes:** application/vnd.apple.pkpass\n\n**Documents:** application/pdf, text/plain, text/markdown, text/vcard, text/rtf, text/csv, text/html, text/calendar, text/xml, application/json, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/x-iwork-pages-sffpages, application/x-iwork-numbers-sffnumbers, application/x-iwork-keynote-sffkey, application/epub+zip, application/zip, application/x-gzip\n\n**Transcoded on delivery:**\n- `audio/x-caf` — CAF files are transcoded to `audio/mp4` for delivery.\n\n**Deprecated (accepted but transcoded):**\n- `audio/mp3` — Deprecated. Use `audio/mpeg` instead. Files sent as audio/mp3 will be delivered as audio/mpeg.\n- `audio/mp4` — Deprecated. Use `audio/x-m4a` instead. Files sent as audio/mp4 will be delivered as audio/x-m4a.\n- `audio/aiff` — Deprecated. Use `audio/x-aiff` instead. Files sent as audio/aiff will be delivered as audio/x-aiff.\n- `image/tiff` — Accepted, but TIFF images are transcoded to JPEG for delivery.\n\n**Unsupported:** FLAC, OGG, and executable files are explicitly rejected.\n\n\n- `filename: string`\n  Name of the file to upload\n\n- `size_bytes: number`\n  Size of the file in bytes (max 100MB)\n\n### Returns\n\n- `{ attachment_id: string; download_url: string; expires_at: string; http_method: \'PUT\'; required_headers: object; upload_url: string; }`\n\n  - `attachment_id: string`\n  - `download_url: string`\n  - `expires_at: string`\n  - `http_method: \'PUT\'`\n  - `required_headers: object`\n  - `upload_url: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from \'@linqapp/sdk\';\n\nconst client = new LinqAPIV3();\n\nconst attachment = await client.attachments.create({\n  content_type: \'image/jpeg\',\n  filename: \'photo.jpg\',\n  size_bytes: 1024000,\n});\n\nconsole.log(attachment);\n```',
    perLanguage: {
      go: {
        method: 'client.Attachments.New',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tattachment, err := client.Attachments.New(context.TODO(), linqgo.AttachmentNewParams{\n\t\tContentType: linqgo.SupportedContentTypeImageJpeg,\n\t\tFilename:    "photo.jpg",\n\t\tSizeBytes:   1024000,\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", attachment.AttachmentID)\n}\n',
      },
      python: {
        method: 'attachments.create',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nattachment = client.attachments.create(\n    content_type="image/jpeg",\n    filename="photo.jpg",\n    size_bytes=1024000,\n)\nprint(attachment.attachment_id)',
      },
      typescript: {
        method: 'client.attachments.create',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst attachment = await client.attachments.create({\n  content_type: 'image/jpeg',\n  filename: 'photo.jpg',\n  size_bytes: 1024000,\n});\n\nconsole.log(attachment.attachment_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/attachments \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "content_type": "image/jpeg",\n          "filename": "photo.jpg",\n          "size_bytes": 1024000\n        }\'',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/attachments/{attachmentId}',
    httpMethod: 'get',
    summary: 'Get attachment metadata',
    description:
      'Retrieve metadata for a specific attachment including file\ninformation, and URLs for downloading.\n\n`status`: (**deprecated** — will be removed in a future API version)\n',
    stainlessPath: '(resource) attachments > (method) retrieve',
    qualified: 'client.attachments.retrieve',
    params: ['attachmentId: string;'],
    response:
      "{ id: string; content_type: string; created_at: string; filename: string; size_bytes: number; status: 'pending' | 'complete' | 'failed'; download_url?: string; }",
    markdown:
      "## retrieve\n\n`client.attachments.retrieve(attachmentId: string): { id: string; content_type: supported_content_type; created_at: string; filename: string; size_bytes: number; status: 'pending' | 'complete' | 'failed'; download_url?: string; }`\n\n**get** `/v3/attachments/{attachmentId}`\n\nRetrieve metadata for a specific attachment including file\ninformation, and URLs for downloading.\n\n`status`: (**deprecated** — will be removed in a future API version)\n\n\n### Parameters\n\n- `attachmentId: string`\n\n### Returns\n\n- `{ id: string; content_type: string; created_at: string; filename: string; size_bytes: number; status: 'pending' | 'complete' | 'failed'; download_url?: string; }`\n\n  - `id: string`\n  - `content_type: string`\n  - `created_at: string`\n  - `filename: string`\n  - `size_bytes: number`\n  - `status: 'pending' | 'complete' | 'failed'`\n  - `download_url?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst attachment = await client.attachments.retrieve('abc12345-1234-5678-9abc-def012345678');\n\nconsole.log(attachment);\n```",
    perLanguage: {
      go: {
        method: 'client.Attachments.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tattachment, err := client.Attachments.Get(context.TODO(), "abc12345-1234-5678-9abc-def012345678")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", attachment.ID)\n}\n',
      },
      python: {
        method: 'attachments.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nattachment = client.attachments.retrieve(\n    "abc12345-1234-5678-9abc-def012345678",\n)\nprint(attachment.id)',
      },
      typescript: {
        method: 'client.attachments.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst attachment = await client.attachments.retrieve('abc12345-1234-5678-9abc-def012345678');\n\nconsole.log(attachment.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/attachments/$ATTACHMENT_ID \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'delete',
    endpoint: '/v3/attachments/{attachmentId}',
    httpMethod: 'delete',
    summary: 'Delete an attachment',
    description: 'Permanently delete an attachment owned by the authenticated partner.',
    stainlessPath: '(resource) attachments > (method) delete',
    qualified: 'client.attachments.delete',
    params: ['attachmentId: string;'],
    markdown:
      "## delete\n\n`client.attachments.delete(attachmentId: string): void`\n\n**delete** `/v3/attachments/{attachmentId}`\n\nPermanently delete an attachment owned by the authenticated partner.\n\n### Parameters\n\n- `attachmentId: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nawait client.attachments.delete('abc12345-1234-5678-9abc-def012345678')\n```",
    perLanguage: {
      go: {
        method: 'client.Attachments.Delete',
        example:
          'package main\n\nimport (\n\t"context"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\terr := client.Attachments.Delete(context.TODO(), "abc12345-1234-5678-9abc-def012345678")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n}\n',
      },
      python: {
        method: 'attachments.delete',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nclient.attachments.delete(\n    "abc12345-1234-5678-9abc-def012345678",\n)',
      },
      typescript: {
        method: 'client.attachments.delete',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.attachments.delete('abc12345-1234-5678-9abc-def012345678');",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/attachments/$ATTACHMENT_ID \\\n    -X DELETE \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'list',
    endpoint: '/v3/phonenumbers',
    httpMethod: 'get',
    summary: 'List phone numbers (deprecated)',
    description: '**Deprecated.** Use `GET /v3/phone_numbers` instead.\n',
    stainlessPath: '(resource) phonenumbers > (method) list',
    qualified: 'client.phonenumbers.list',
    response:
      '{ phone_numbers: { id: string; phone_number: string; capabilities?: { mms: boolean; sms: boolean; voice: boolean; }; country_code?: string; type?: string; }[]; }',
    markdown:
      "## list\n\n`client.phonenumbers.list(): { phone_numbers: object[]; }`\n\n**get** `/v3/phonenumbers`\n\n**Deprecated.** Use `GET /v3/phone_numbers` instead.\n\n\n### Returns\n\n- `{ phone_numbers: { id: string; phone_number: string; capabilities?: { mms: boolean; sms: boolean; voice: boolean; }; country_code?: string; type?: string; }[]; }`\n\n  - `phone_numbers: { id: string; phone_number: string; capabilities?: { mms: boolean; sms: boolean; voice: boolean; }; country_code?: string; type?: string; }[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst phonenumbers = await client.phonenumbers.list();\n\nconsole.log(phonenumbers);\n```",
    perLanguage: {
      go: {
        method: 'client.Phonenumbers.List',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tphonenumbers, err := client.Phonenumbers.List(context.TODO())\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", phonenumbers.PhoneNumbers)\n}\n',
      },
      python: {
        method: 'phonenumbers.list',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nphonenumbers = client.phonenumbers.list()\nprint(phonenumbers.phone_numbers)',
      },
      typescript: {
        method: 'client.phonenumbers.list',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst phonenumbers = await client.phonenumbers.list();\n\nconsole.log(phonenumbers.phone_numbers);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/phonenumbers \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'list',
    endpoint: '/v3/phone_numbers',
    httpMethod: 'get',
    summary: 'List phone numbers',
    description:
      'Returns all phone numbers assigned to the authenticated partner.\nUse this endpoint to discover which phone numbers are available for\nuse as the `from` field when creating a chat, listing chats, or sending a voice memo.\n',
    stainlessPath: '(resource) phone_numbers > (method) list',
    qualified: 'client.phoneNumbers.list',
    response:
      "{ phone_numbers: { id: string; phone_number: string; reputation: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL'; }; forwarding_number?: string; }[]; }",
    markdown:
      "## list\n\n`client.phoneNumbers.list(): { phone_numbers: object[]; }`\n\n**get** `/v3/phone_numbers`\n\nReturns all phone numbers assigned to the authenticated partner.\nUse this endpoint to discover which phone numbers are available for\nuse as the `from` field when creating a chat, listing chats, or sending a voice memo.\n\n\n### Returns\n\n- `{ phone_numbers: { id: string; phone_number: string; reputation: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL'; }; forwarding_number?: string; }[]; }`\n\n  - `phone_numbers: { id: string; phone_number: string; reputation: { doc_url: string; status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL'; }; forwarding_number?: string; }[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst phoneNumbers = await client.phoneNumbers.list();\n\nconsole.log(phoneNumbers);\n```",
    perLanguage: {
      go: {
        method: 'client.PhoneNumbers.List',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tphoneNumbers, err := client.PhoneNumbers.List(context.TODO())\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", phoneNumbers.PhoneNumbers)\n}\n',
      },
      python: {
        method: 'phone_numbers.list',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nphone_numbers = client.phone_numbers.list()\nprint(phone_numbers.phone_numbers)',
      },
      typescript: {
        method: 'client.phoneNumbers.list',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst phoneNumbers = await client.phoneNumbers.list();\n\nconsole.log(phoneNumbers.phone_numbers);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/phone_numbers \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'update',
    endpoint: '/v3/phone_numbers/{phoneNumberId}',
    httpMethod: 'put',
    summary: 'Update a phone number',
    description:
      'Updates the forwarding number for a phone number. The forwarding number is where inbound calls will be forwarded to.\n\nPass an empty string to clear the forwarding number.\n',
    stainlessPath: '(resource) phone_numbers > (method) update',
    qualified: 'client.phoneNumbers.update',
    params: ['phoneNumberId: string;', 'forwarding_number: string;'],
    response: '{ id: string; forwarding_number: string; phone_number: string; }',
    markdown:
      "## update\n\n`client.phoneNumbers.update(phoneNumberId: string, forwarding_number: string): { id: string; forwarding_number: string; phone_number: string; }`\n\n**put** `/v3/phone_numbers/{phoneNumberId}`\n\nUpdates the forwarding number for a phone number. The forwarding number is where inbound calls will be forwarded to.\n\nPass an empty string to clear the forwarding number.\n\n\n### Parameters\n\n- `phoneNumberId: string`\n\n- `forwarding_number: string`\n  The forwarding number in E.164 format. Set to null or empty string to clear.\n\n\n### Returns\n\n- `{ id: string; forwarding_number: string; phone_number: string; }`\n\n  - `id: string`\n  - `forwarding_number: string`\n  - `phone_number: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst phoneNumber = await client.phoneNumbers.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', { forwarding_number: '+12025559999' });\n\nconsole.log(phoneNumber);\n```",
    perLanguage: {
      go: {
        method: 'client.PhoneNumbers.Update',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tphoneNumber, err := client.PhoneNumbers.Update(\n\t\tcontext.TODO(),\n\t\t"182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e",\n\t\tlinqgo.PhoneNumberUpdateParams{\n\t\t\tForwardingNumber: linqgo.String("+12025559999"),\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", phoneNumber.ID)\n}\n',
      },
      python: {
        method: 'phone_numbers.update',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nphone_number = client.phone_numbers.update(\n    phone_number_id="182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e",\n    forwarding_number="+12025559999",\n)\nprint(phone_number.id)',
      },
      typescript: {
        method: 'client.phoneNumbers.update',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst phoneNumber = await client.phoneNumbers.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {\n  forwarding_number: '+12025559999',\n});\n\nconsole.log(phoneNumber.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/phone_numbers/$PHONE_NUMBER_ID \\\n    -X PUT \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "forwarding_number": "+12025559999"\n        }\'',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/available_number',
    httpMethod: 'get',
    summary: 'Get an available sending number',
    description:
      'Returns the best available line (E.164) to send from, applying smart\nnumber assignment. Optionally pass `to` recipients to make the choice\n"sticky" — reusing the line an existing chat with those recipients is\nalready on. Without `to`, the best available line is chosen, always\npreferring lines with a healthier reputation.\n\nThis does not reserve the line. Without `to`, the least-recently-used\navailable line is returned — suggestions and your own sends (including\nan explicit `from` on chat creation) both count as use, so successive\ncalls cycle through your available lines and traffic spreads evenly.\nPass the returned `phone_number` as `from` when you create the chat to\nguarantee the same line.\n\nAlso returns `vcf_url`: a time-limited link to a vCard (`.vcf`) for the\nchosen line, carrying its contact card (name/photo) with the chosen\nnumber as the primary `TEL` and the partner\'s other available lines as\nbackups. Share it with recipients so they can save the line as a contact.\nLines you pass in `exclude_from` are left out of the vCard too.\n',
    stainlessPath: '(resource) available_number > (method) retrieve',
    qualified: 'client.availableNumber.retrieve',
    params: ['exclude_from?: string[];', 'to?: string[];'],
    response: '{ phone_number: string; vcf_url: string; }',
    markdown:
      "## retrieve\n\n`client.availableNumber.retrieve(exclude_from?: string[], to?: string[]): { phone_number: string; vcf_url: string; }`\n\n**get** `/v3/available_number`\n\nReturns the best available line (E.164) to send from, applying smart\nnumber assignment. Optionally pass `to` recipients to make the choice\n\"sticky\" — reusing the line an existing chat with those recipients is\nalready on. Without `to`, the best available line is chosen, always\npreferring lines with a healthier reputation.\n\nThis does not reserve the line. Without `to`, the least-recently-used\navailable line is returned — suggestions and your own sends (including\nan explicit `from` on chat creation) both count as use, so successive\ncalls cycle through your available lines and traffic spreads evenly.\nPass the returned `phone_number` as `from` when you create the chat to\nguarantee the same line.\n\nAlso returns `vcf_url`: a time-limited link to a vCard (`.vcf`) for the\nchosen line, carrying its contact card (name/photo) with the chosen\nnumber as the primary `TEL` and the partner's other available lines as\nbackups. Share it with recipients so they can save the line as a contact.\nLines you pass in `exclude_from` are left out of the vCard too.\n\n\n### Parameters\n\n- `exclude_from?: string[]`\n  Lines (E.164) to leave out of this selection. Applies to the returned\n`phone_number`, to the sticky choice when `to` is given, and to the\nvCard's backup numbers. Repeat the parameter for multiple lines; use\n`%2B` for the leading `+`.\n\nNumbers that are not your lines are ignored. Every entry must be\nE.164 — a value like `4155551234` is rejected rather than silently\nskipped. Excluding every one of your available lines returns 400.\n\n\n- `to?: string[]`\n  Recipient handles (E.164 or email) the message is destined for. When\nprovided, an existing chat with these recipients makes the choice\nsticky. Repeat the parameter for multiple recipients.\n\n\n### Returns\n\n- `{ phone_number: string; vcf_url: string; }`\n  The line smart number assignment selected, plus a shareable vCard.\n\n  - `phone_number: string`\n  - `vcf_url: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst availableNumber = await client.availableNumber.retrieve();\n\nconsole.log(availableNumber);\n```",
    perLanguage: {
      go: {
        method: 'client.AvailableNumber.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tavailableNumber, err := client.AvailableNumber.Get(context.TODO(), linqgo.AvailableNumberGetParams{})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", availableNumber.PhoneNumber)\n}\n',
      },
      python: {
        method: 'available_number.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\navailable_number = client.available_number.retrieve()\nprint(available_number.phone_number)',
      },
      typescript: {
        method: 'client.availableNumber.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst availableNumber = await client.availableNumber.retrieve();\n\nconsole.log(availableNumber.phone_number);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/available_number \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'create',
    endpoint: '/v3/payment_requests',
    httpMethod: 'post',
    summary: 'Create a payment request',
    description:
      "Creates a payment request and returns a `checkout_url` the recipient\nopens to pay with Apple Pay or card. Funds settle directly to your\nconnected Stripe account. A payment request is independent of any chat;\nto associate one with a chat for your records, store the chat id in\n`metadata`. Requires your connected account to be `charges_enabled`\n(returns `403` otherwise).\n\nSet `mode: subscription` with a recurring `price_id` from your connected\nStripe account to start an **auto-renewing subscription** instead of a\none-time charge — the recipient pays the first invoice at checkout and\nthe response's `stripe` object carries the customer and subscription ids\nfor the ongoing lifecycle in your own Stripe account. See the\n*Subscriptions* section of the tag overview.\n\nIn either mode, pass `customer_id` to attach the request to an\n**existing Customer** on your connected account instead of creating a\nnew one — see *Pre-created customers* in the tag overview.\n",
    stainlessPath: '(resource) payment_requests > (method) create',
    qualified: 'client.paymentRequests.create',
    params: [
      'amount?: number;',
      'currency?: string;',
      'customer_id?: string;',
      'description?: string;',
      'from?: string;',
      'metadata?: object;',
      "mode?: 'payment' | 'subscription';",
      'payer_handle?: string;',
      'price_id?: string;',
      'quantity?: number;',
      "rail?: 'stripe' | 'natural';",
      'trial_end?: string;',
      'trial_period_days?: number;',
      'Idempotency-Key?: string;',
    ],
    response:
      "{ id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: { payment_request_id?: string; transaction_id?: string; }; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }; trial_end?: string; updated_at?: string; }",
    markdown:
      "## create\n\n`client.paymentRequests.create(amount?: number, currency?: string, customer_id?: string, description?: string, from?: string, metadata?: object, mode?: 'payment' | 'subscription', payer_handle?: string, price_id?: string, quantity?: number, rail?: 'stripe' | 'natural', trial_end?: string, trial_period_days?: number, Idempotency-Key?: string): { id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: object; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: object; trial_end?: string; updated_at?: string; }`\n\n**post** `/v3/payment_requests`\n\nCreates a payment request and returns a `checkout_url` the recipient\nopens to pay with Apple Pay or card. Funds settle directly to your\nconnected Stripe account. A payment request is independent of any chat;\nto associate one with a chat for your records, store the chat id in\n`metadata`. Requires your connected account to be `charges_enabled`\n(returns `403` otherwise).\n\nSet `mode: subscription` with a recurring `price_id` from your connected\nStripe account to start an **auto-renewing subscription** instead of a\none-time charge — the recipient pays the first invoice at checkout and\nthe response's `stripe` object carries the customer and subscription ids\nfor the ongoing lifecycle in your own Stripe account. See the\n*Subscriptions* section of the tag overview.\n\nIn either mode, pass `customer_id` to attach the request to an\n**existing Customer** on your connected account instead of creating a\nnew one — see *Pre-created customers* in the tag overview.\n\n\n### Parameters\n\n- `amount?: number`\n  Amount to charge, in the currency's minor units (e.g. cents). Must be\nat least the payment provider's minimum (50 for `usd`). Required in\n`payment` mode; must be omitted in `subscription` mode (the amount\ncomes from the price).\n\n\n- `currency?: string`\n  Three-letter ISO 4217 currency code. Only `usd` is currently\nsupported. Required in `payment` mode; must be omitted in\n`subscription` mode (the currency comes from the price).\n\n\n- `customer_id?: string`\n  Optional id of an **existing Customer** on your connected Stripe\naccount (`cus_...`) to attach this request to, instead of a new\nCustomer being created. In `payment` mode the charge lands on that\ncustomer's payment history; in `subscription` mode the subscription\nis created on them. The customer must exist (and not be deleted) on\nyour connected account.\n\n\n- `description?: string`\n  Optional description shown to the recipient at checkout.\n\n- `from?: string`\n  Required for `rail: natural`. The line the request is sent from, in\nE.164 format. Must be a phone number your organization owns.\n\n\n- `metadata?: object`\n  Optional key/value metadata (up to 49 keys) echoed back on retrieval\nand on `payment.*` webhooks, and stamped on the Stripe objects we\ncreate on your connected account (the PaymentIntent, and in\nsubscription mode the Subscription and any Customer created for\nyou — a customer you pass via `customer_id` is never modified) —\nuse it to correlate a request with your own records (e.g. a chat\nid). Keys starting with `linq_` are reserved.\n\n\n- `mode?: 'payment' | 'subscription'`\n  `payment` (default) collects a one-time charge for `amount` +\n`currency`. `subscription` starts an auto-renewing subscription from\na recurring `price_id` on your connected Stripe account: the\nrecipient pays the first invoice at checkout and Stripe renews it\nautomatically from then on.\n\n\n- `payer_handle?: string`\n  Required for `rail: natural`. The payer to bill, in E.164 format.\n\n\n- `price_id?: string`\n  Subscription mode only (required there): id of an **active recurring\nPrice** on your connected Stripe account (`price_...`). If you sell\nthrough Stripe Payment Links today, pass the same price the link was\nbuilt from to get the native iMessage checkout for it.\n\n\n- `quantity?: number`\n  Subscription mode only — units of the price to subscribe to.\n\n- `rail?: 'stripe' | 'natural'`\n  Payment rail. `stripe` (default) is the direct-charge flow that\nsettles to your connected Stripe account. `natural` collects through\nthe Natural custodial wallet; it requires `from` + `payer_handle` and\nthat your organization has completed Natural merchant onboarding.\n\n\n- `trial_end?: string`\n  Subscription mode only — end the free trial at a fixed timestamp\n(must be in the future) instead of a day count. Mutually exclusive\nwith `trial_period_days`.\n\n\n- `trial_period_days?: number`\n  Subscription mode only — start with a free trial of this many days.\nThe recipient's card is still collected at checkout (Apple Pay or\ncard), saved to the subscription, and first charged when the trial\nends. Mutually exclusive with `trial_end`.\n\n\n- `Idempotency-Key?: string`\n\n### Returns\n\n- `{ id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: { payment_request_id?: string; transaction_id?: string; }; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }; trial_end?: string; updated_at?: string; }`\n\n  - `id: string`\n  - `amount: number`\n  - `checkout_url: string`\n  - `created_at: string`\n  - `currency: string`\n  - `mode: 'payment' | 'subscription'`\n  - `object: string`\n  - `status: 'requested' | 'succeeded' | 'canceled' | 'expired'`\n  - `description?: string`\n  - `expires_at?: string`\n  - `interval?: 'day' | 'week' | 'month' | 'year'`\n  - `interval_count?: number`\n  - `metadata?: object`\n  - `natural?: { payment_request_id?: string; transaction_id?: string; }`\n  - `paid_at?: string`\n  - `price_id?: string`\n  - `quantity?: number`\n  - `rail?: 'stripe' | 'natural'`\n  - `stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }`\n  - `trial_end?: string`\n  - `updated_at?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst paymentRequest = await client.paymentRequests.create();\n\nconsole.log(paymentRequest);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentRequests.New',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpaymentRequest, err := client.PaymentRequests.New(context.TODO(), linqgo.PaymentRequestNewParams{\n\t\tAmount:      linqgo.Int(497),\n\t\tCurrency:    linqgo.String("usd"),\n\t\tDescription: linqgo.String("Coffee with Ava"),\n\t\tMetadata: map[string]string{\n\t\t\t"order_id": "order_8675309",\n\t\t},\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", paymentRequest.ID)\n}\n',
      },
      python: {
        method: 'payment_requests.create',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment_request = client.payment_requests.create(\n    amount=497,\n    currency="usd",\n    description="Coffee with Ava",\n    metadata={\n        "order_id": "order_8675309"\n    },\n)\nprint(payment_request.id)',
      },
      typescript: {
        method: 'client.paymentRequests.create',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst paymentRequest = await client.paymentRequests.create({\n  amount: 497,\n  currency: 'usd',\n  description: 'Coffee with Ava',\n  metadata: { order_id: 'order_8675309' },\n});\n\nconsole.log(paymentRequest.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payment_requests \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "amount": 497,\n          "currency": "usd",\n          "customer_id": "cus_QAbCdEfGhIjKlMn",\n          "description": "Coffee with Ava",\n          "from": "+12025550123",\n          "metadata": {\n            "order_id": "order_8675309"\n          },\n          "payer_handle": "+12025550199",\n          "price_id": "price_1QAbCdEfGhIjKlMn",\n          "trial_period_days": 14\n        }\'',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/payment_requests/{paymentRequestId}',
    httpMethod: 'get',
    summary: 'Get a payment request',
    description: "Returns a payment request's status and details.\n",
    stainlessPath: '(resource) payment_requests > (method) retrieve',
    qualified: 'client.paymentRequests.retrieve',
    params: ['paymentRequestId: string;'],
    response:
      "{ id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: { payment_request_id?: string; transaction_id?: string; }; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }; trial_end?: string; updated_at?: string; }",
    markdown:
      "## retrieve\n\n`client.paymentRequests.retrieve(paymentRequestId: string): { id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: object; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: object; trial_end?: string; updated_at?: string; }`\n\n**get** `/v3/payment_requests/{paymentRequestId}`\n\nReturns a payment request's status and details.\n\n\n### Parameters\n\n- `paymentRequestId: string`\n\n### Returns\n\n- `{ id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: { payment_request_id?: string; transaction_id?: string; }; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }; trial_end?: string; updated_at?: string; }`\n\n  - `id: string`\n  - `amount: number`\n  - `checkout_url: string`\n  - `created_at: string`\n  - `currency: string`\n  - `mode: 'payment' | 'subscription'`\n  - `object: string`\n  - `status: 'requested' | 'succeeded' | 'canceled' | 'expired'`\n  - `description?: string`\n  - `expires_at?: string`\n  - `interval?: 'day' | 'week' | 'month' | 'year'`\n  - `interval_count?: number`\n  - `metadata?: object`\n  - `natural?: { payment_request_id?: string; transaction_id?: string; }`\n  - `paid_at?: string`\n  - `price_id?: string`\n  - `quantity?: number`\n  - `rail?: 'stripe' | 'natural'`\n  - `stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }`\n  - `trial_end?: string`\n  - `updated_at?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst paymentRequest = await client.paymentRequests.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');\n\nconsole.log(paymentRequest);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentRequests.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpaymentRequest, err := client.PaymentRequests.Get(context.TODO(), "182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", paymentRequest.ID)\n}\n',
      },
      python: {
        method: 'payment_requests.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment_request = client.payment_requests.retrieve(\n    "182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e",\n)\nprint(payment_request.id)',
      },
      typescript: {
        method: 'client.paymentRequests.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst paymentRequest = await client.paymentRequests.retrieve(\n  '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',\n);\n\nconsole.log(paymentRequest.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payment_requests/$PAYMENT_REQUEST_ID \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'list',
    endpoint: '/v3/payment_requests',
    httpMethod: 'get',
    summary: 'List payment requests',
    description:
      'Lists your payment requests, newest first, for reconciliation. Paginate\nwith `limit` + `offset`; `has_more` indicates whether another page exists.\n',
    stainlessPath: '(resource) payment_requests > (method) list',
    qualified: 'client.paymentRequests.list',
    params: [
      'limit?: number;',
      'offset?: number;',
      "status?: 'requested' | 'authorized' | 'succeeded' | 'canceled' | 'expired' | 'declined';",
    ],
    response:
      "{ data: { id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: object; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: object; trial_end?: string; updated_at?: string; }[]; has_more: boolean; object: 'list'; }",
    markdown:
      "## list\n\n`client.paymentRequests.list(limit?: number, offset?: number, status?: 'requested' | 'authorized' | 'succeeded' | 'canceled' | 'expired' | 'declined'): { data: payment_request[]; has_more: boolean; object: 'list'; }`\n\n**get** `/v3/payment_requests`\n\nLists your payment requests, newest first, for reconciliation. Paginate\nwith `limit` + `offset`; `has_more` indicates whether another page exists.\n\n\n### Parameters\n\n- `limit?: number`\n  Max results to return (default 20, max 100).\n\n- `offset?: number`\n  Number of results to skip.\n\n- `status?: 'requested' | 'authorized' | 'succeeded' | 'canceled' | 'expired' | 'declined'`\n  Filter by lifecycle status.\n\n### Returns\n\n- `{ data: { id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: object; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: object; trial_end?: string; updated_at?: string; }[]; has_more: boolean; object: 'list'; }`\n\n  - `data: { id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: { payment_request_id?: string; transaction_id?: string; }; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }; trial_end?: string; updated_at?: string; }[]`\n  - `has_more: boolean`\n  - `object: 'list'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst paymentRequests = await client.paymentRequests.list();\n\nconsole.log(paymentRequests);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentRequests.List',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpaymentRequests, err := client.PaymentRequests.List(context.TODO(), linqgo.PaymentRequestListParams{})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", paymentRequests.Data)\n}\n',
      },
      python: {
        method: 'payment_requests.list',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment_requests = client.payment_requests.list()\nprint(payment_requests.data)',
      },
      typescript: {
        method: 'client.paymentRequests.list',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst paymentRequests = await client.paymentRequests.list();\n\nconsole.log(paymentRequests.data);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payment_requests \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'cancel',
    endpoint: '/v3/payment_requests/{paymentRequestId}/cancel',
    httpMethod: 'post',
    summary: 'Cancel a payment request',
    description:
      'Cancels an unpaid payment request: the underlying payment intent is\ncanceled and the request moves to `canceled`. A request that is already\npaid, canceled, or expired returns 409.\n',
    stainlessPath: '(resource) payment_requests > (method) cancel',
    qualified: 'client.paymentRequests.cancel',
    params: ['paymentRequestId: string;'],
    response:
      "{ id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: { payment_request_id?: string; transaction_id?: string; }; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }; trial_end?: string; updated_at?: string; }",
    markdown:
      "## cancel\n\n`client.paymentRequests.cancel(paymentRequestId: string): { id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: object; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: object; trial_end?: string; updated_at?: string; }`\n\n**post** `/v3/payment_requests/{paymentRequestId}/cancel`\n\nCancels an unpaid payment request: the underlying payment intent is\ncanceled and the request moves to `canceled`. A request that is already\npaid, canceled, or expired returns 409.\n\n\n### Parameters\n\n- `paymentRequestId: string`\n\n### Returns\n\n- `{ id: string; amount: number; checkout_url: string; created_at: string; currency: string; mode: 'payment' | 'subscription'; object: string; status: 'requested' | 'succeeded' | 'canceled' | 'expired'; description?: string; expires_at?: string; interval?: 'day' | 'week' | 'month' | 'year'; interval_count?: number; metadata?: object; natural?: { payment_request_id?: string; transaction_id?: string; }; paid_at?: string; price_id?: string; quantity?: number; rail?: 'stripe' | 'natural'; stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }; trial_end?: string; updated_at?: string; }`\n\n  - `id: string`\n  - `amount: number`\n  - `checkout_url: string`\n  - `created_at: string`\n  - `currency: string`\n  - `mode: 'payment' | 'subscription'`\n  - `object: string`\n  - `status: 'requested' | 'succeeded' | 'canceled' | 'expired'`\n  - `description?: string`\n  - `expires_at?: string`\n  - `interval?: 'day' | 'week' | 'month' | 'year'`\n  - `interval_count?: number`\n  - `metadata?: object`\n  - `natural?: { payment_request_id?: string; transaction_id?: string; }`\n  - `paid_at?: string`\n  - `price_id?: string`\n  - `quantity?: number`\n  - `rail?: 'stripe' | 'natural'`\n  - `stripe?: { customer_id?: string; payment_intent_id?: string; subscription_id?: string; }`\n  - `trial_end?: string`\n  - `updated_at?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst paymentRequest = await client.paymentRequests.cancel('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');\n\nconsole.log(paymentRequest);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentRequests.Cancel',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpaymentRequest, err := client.PaymentRequests.Cancel(context.TODO(), "182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", paymentRequest.ID)\n}\n',
      },
      python: {
        method: 'payment_requests.cancel',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment_request = client.payment_requests.cancel(\n    "182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e",\n)\nprint(payment_request.id)',
      },
      typescript: {
        method: 'client.paymentRequests.cancel',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst paymentRequest = await client.paymentRequests.cancel('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');\n\nconsole.log(paymentRequest.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payment_requests/$PAYMENT_REQUEST_ID/cancel \\\n    -X POST \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'connect',
    endpoint: '/v3/payments/providers/{provider}/connect',
    httpMethod: 'post',
    summary: 'Start payment-provider onboarding',
    description:
      'Begins connecting your organization to a payment provider (e.g.\n`agentcard`). Returns a hosted URL where an admin authorizes the\nconnection; on completion the provider redirects back and Linq stores\nyour connected credentials.\n',
    stainlessPath: '(resource) payment_providers > (method) connect',
    qualified: 'client.paymentProviders.connect',
    params: ['provider: string;', 'return_url: string;'],
    response: '{ hosted_url?: string; session_id?: string; status?: string; }',
    markdown:
      "## connect\n\n`client.paymentProviders.connect(provider: string, return_url: string): { hosted_url?: string; session_id?: string; status?: string; }`\n\n**post** `/v3/payments/providers/{provider}/connect`\n\nBegins connecting your organization to a payment provider (e.g.\n`agentcard`). Returns a hosted URL where an admin authorizes the\nconnection; on completion the provider redirects back and Linq stores\nyour connected credentials.\n\n\n### Parameters\n\n- `provider: string`\n\n- `return_url: string`\n  Where to send the admin after they authorize the connection.\n\n### Returns\n\n- `{ hosted_url?: string; session_id?: string; status?: string; }`\n\n  - `hosted_url?: string`\n  - `session_id?: string`\n  - `status?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst response = await client.paymentProviders.connect('provider', { return_url: 'https://partner.example/settings/payments' });\n\nconsole.log(response);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentProviders.Connect',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tresponse, err := client.PaymentProviders.Connect(\n\t\tcontext.TODO(),\n\t\t"provider",\n\t\tlinqgo.PaymentProviderConnectParams{\n\t\t\tReturnURL: "https://partner.example/settings/payments",\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", response.SessionID)\n}\n',
      },
      python: {
        method: 'payment_providers.connect',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.payment_providers.connect(\n    provider="provider",\n    return_url="https://partner.example/settings/payments",\n)\nprint(response.session_id)',
      },
      typescript: {
        method: 'client.paymentProviders.connect',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.paymentProviders.connect('provider', {\n  return_url: 'https://partner.example/settings/payments',\n});\n\nconsole.log(response.session_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments/providers/$PROVIDER/connect \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "return_url": "https://partner.example/settings/payments"\n        }\'',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/payments/providers/{provider}',
    httpMethod: 'get',
    summary: 'Get payment-provider status',
    description: "Returns your organization's onboarding status for a payment provider.\n",
    stainlessPath: '(resource) payment_providers > (method) retrieve',
    qualified: 'client.paymentProviders.retrieve',
    params: ['provider: string;'],
    response: "{ provider?: string; status?: 'onboarding' | 'ready' | 'disabled'; }",
    markdown:
      "## retrieve\n\n`client.paymentProviders.retrieve(provider: string): { provider?: string; status?: 'onboarding' | 'ready' | 'disabled'; }`\n\n**get** `/v3/payments/providers/{provider}`\n\nReturns your organization's onboarding status for a payment provider.\n\n\n### Parameters\n\n- `provider: string`\n\n### Returns\n\n- `{ provider?: string; status?: 'onboarding' | 'ready' | 'disabled'; }`\n\n  - `provider?: string`\n  - `status?: 'onboarding' | 'ready' | 'disabled'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst paymentProvider = await client.paymentProviders.retrieve('provider');\n\nconsole.log(paymentProvider);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentProviders.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpaymentProvider, err := client.PaymentProviders.Get(context.TODO(), "provider")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", paymentProvider.Provider)\n}\n',
      },
      python: {
        method: 'payment_providers.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment_provider = client.payment_providers.retrieve(\n    "provider",\n)\nprint(payment_provider.provider)',
      },
      typescript: {
        method: 'client.paymentProviders.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst paymentProvider = await client.paymentProviders.retrieve('provider');\n\nconsole.log(paymentProvider.provider);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments/providers/$PROVIDER \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'connect',
    endpoint: '/v3/payments/handles/{handle}/connect',
    httpMethod: 'post',
    summary: 'Connect a customer handle',
    description:
      'Starts connecting a customer (by phone/email) so an agent can pay on\ntheir behalf. Linq drives the OTP + consent ceremony through the\nmessaging channel; this returns `pending` and a `connection.created`\nwebhook fires once the customer completes it.\n',
    stainlessPath: '(resource) payment_handles > (method) connect',
    qualified: 'client.paymentHandles.connect',
    params: ['handle: string;'],
    response:
      "{ connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }",
    markdown:
      "## connect\n\n`client.paymentHandles.connect(handle: string): { connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }`\n\n**post** `/v3/payments/handles/{handle}/connect`\n\nStarts connecting a customer (by phone/email) so an agent can pay on\ntheir behalf. Linq drives the OTP + consent ceremony through the\nmessaging channel; this returns `pending` and a `connection.created`\nwebhook fires once the customer completes it.\n\n\n### Parameters\n\n- `handle: string`\n\n### Returns\n\n- `{ connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }`\n\n  - `connect_id?: string`\n  - `handle?: string`\n  - `status?: 'not_connected' | 'pending' | 'connected' | 'revoked'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst paymentHandleConnection = await client.paymentHandles.connect('handle');\n\nconsole.log(paymentHandleConnection);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentHandles.Connect',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpaymentHandleConnection, err := client.PaymentHandles.Connect(context.TODO(), "handle")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", paymentHandleConnection.ConnectID)\n}\n',
      },
      python: {
        method: 'payment_handles.connect',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment_handle_connection = client.payment_handles.connect(\n    "handle",\n)\nprint(payment_handle_connection.connect_id)',
      },
      typescript: {
        method: 'client.paymentHandles.connect',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst paymentHandleConnection = await client.paymentHandles.connect('handle');\n\nconsole.log(paymentHandleConnection.connect_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments/handles/$HANDLE/connect \\\n    -X POST \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'verify',
    endpoint: '/v3/payments/handles/{handle}/verify',
    httpMethod: 'post',
    summary: "Submit a customer's one-time code",
    description:
      "Completes the ceremony `connect` started: verifies the code, records the\ncustomer's consent, and stores the connection. Returns `connected` on\nsuccess, after which payments for this handle no longer need the\ncustomer present.\n\nThe code reaches you however your channel works — typically the customer\nreplies with it in the thread. Codes are single-use and short-lived; if\none has expired, call `connect` again for a fresh `connect_id`.\n",
    stainlessPath: '(resource) payment_handles > (method) verify',
    qualified: 'client.paymentHandles.verify',
    params: ['handle: string;', 'code: string;', 'connect_id: string;'],
    response:
      "{ connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }",
    markdown:
      "## verify\n\n`client.paymentHandles.verify(handle: string, code: string, connect_id: string): { connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }`\n\n**post** `/v3/payments/handles/{handle}/verify`\n\nCompletes the ceremony `connect` started: verifies the code, records the\ncustomer's consent, and stores the connection. Returns `connected` on\nsuccess, after which payments for this handle no longer need the\ncustomer present.\n\nThe code reaches you however your channel works — typically the customer\nreplies with it in the thread. Codes are single-use and short-lived; if\none has expired, call `connect` again for a fresh `connect_id`.\n\n\n### Parameters\n\n- `handle: string`\n\n- `code: string`\n  The one-time code the customer received.\n\n- `connect_id: string`\n  The id returned by `connect`.\n\n### Returns\n\n- `{ connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }`\n\n  - `connect_id?: string`\n  - `handle?: string`\n  - `status?: 'not_connected' | 'pending' | 'connected' | 'revoked'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst paymentHandleConnection = await client.paymentHandles.verify('handle', { code: '482913', connect_id: 'cs_01HZY8' });\n\nconsole.log(paymentHandleConnection);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentHandles.Verify',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpaymentHandleConnection, err := client.PaymentHandles.Verify(\n\t\tcontext.TODO(),\n\t\t"handle",\n\t\tlinqgo.PaymentHandleVerifyParams{\n\t\t\tCode:      "482913",\n\t\t\tConnectID: "cs_01HZY8",\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", paymentHandleConnection.ConnectID)\n}\n',
      },
      python: {
        method: 'payment_handles.verify',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment_handle_connection = client.payment_handles.verify(\n    handle="handle",\n    code="482913",\n    connect_id="cs_01HZY8",\n)\nprint(payment_handle_connection.connect_id)',
      },
      typescript: {
        method: 'client.paymentHandles.verify',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst paymentHandleConnection = await client.paymentHandles.verify('handle', {\n  code: '482913',\n  connect_id: 'cs_01HZY8',\n});\n\nconsole.log(paymentHandleConnection.connect_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments/handles/$HANDLE/verify \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "code": "482913",\n          "connect_id": "cs_01HZY8"\n        }\'',
      },
    },
  },
  {
    name: 'connection',
    endpoint: '/v3/payments/handles/{handle}/connection',
    httpMethod: 'get',
    summary: "Get a handle's connection status",
    description: "Get a handle's connection status",
    stainlessPath: '(resource) payment_handles > (method) connection',
    qualified: 'client.paymentHandles.connection',
    params: ['handle: string;'],
    response:
      "{ connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }",
    markdown:
      "## connection\n\n`client.paymentHandles.connection(handle: string): { connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }`\n\n**get** `/v3/payments/handles/{handle}/connection`\n\nGet a handle's connection status\n\n### Parameters\n\n- `handle: string`\n\n### Returns\n\n- `{ connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }`\n\n  - `connect_id?: string`\n  - `handle?: string`\n  - `status?: 'not_connected' | 'pending' | 'connected' | 'revoked'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst paymentHandleConnection = await client.paymentHandles.connection('handle');\n\nconsole.log(paymentHandleConnection);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentHandles.Connection',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpaymentHandleConnection, err := client.PaymentHandles.Connection(context.TODO(), "handle")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", paymentHandleConnection.ConnectID)\n}\n',
      },
      python: {
        method: 'payment_handles.connection',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment_handle_connection = client.payment_handles.connection(\n    "handle",\n)\nprint(payment_handle_connection.connect_id)',
      },
      typescript: {
        method: 'client.paymentHandles.connection',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst paymentHandleConnection = await client.paymentHandles.connection('handle');\n\nconsole.log(paymentHandleConnection.connect_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments/handles/$HANDLE/connection \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'revoke',
    endpoint: '/v3/payments/handles/{handle}/connection',
    httpMethod: 'delete',
    summary: "Revoke a handle's connection",
    description:
      "Revokes this partner's grant for the customer. Only your grant is\nremoved; the customer's wallet at the provider is untouched.\n",
    stainlessPath: '(resource) payment_handles > (method) revoke',
    qualified: 'client.paymentHandles.revoke',
    params: ['handle: string;'],
    response:
      "{ connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }",
    markdown:
      "## revoke\n\n`client.paymentHandles.revoke(handle: string): { connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }`\n\n**delete** `/v3/payments/handles/{handle}/connection`\n\nRevokes this partner's grant for the customer. Only your grant is\nremoved; the customer's wallet at the provider is untouched.\n\n\n### Parameters\n\n- `handle: string`\n\n### Returns\n\n- `{ connect_id?: string; handle?: string; status?: 'not_connected' | 'pending' | 'connected' | 'revoked'; }`\n\n  - `connect_id?: string`\n  - `handle?: string`\n  - `status?: 'not_connected' | 'pending' | 'connected' | 'revoked'`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst paymentHandleConnection = await client.paymentHandles.revoke('handle');\n\nconsole.log(paymentHandleConnection);\n```",
    perLanguage: {
      go: {
        method: 'client.PaymentHandles.Revoke',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpaymentHandleConnection, err := client.PaymentHandles.Revoke(context.TODO(), "handle")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", paymentHandleConnection.ConnectID)\n}\n',
      },
      python: {
        method: 'payment_handles.revoke',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment_handle_connection = client.payment_handles.revoke(\n    "handle",\n)\nprint(payment_handle_connection.connect_id)',
      },
      typescript: {
        method: 'client.paymentHandles.revoke',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst paymentHandleConnection = await client.paymentHandles.revoke('handle');\n\nconsole.log(paymentHandleConnection.connect_id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments/handles/$HANDLE/connection \\\n    -X DELETE \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'create',
    endpoint: '/v3/payments',
    httpMethod: 'post',
    summary: "Create a payment (agent pays on a customer's behalf)",
    description:
      'Advances the pay flow for a connected customer handle and returns a\n`status` describing where it is (`needs_connection`, `awaiting_user_action`,\n`ready`, ...). A payment `id` appears once a card is minted. Idempotent on\nthe `Idempotency-Key` header.\n',
    stainlessPath: '(resource) payments > (method) create',
    qualified: 'client.payments.create',
    params: [
      'amount_cents: number;',
      'currency: string;',
      'handle: string;',
      'description?: string;',
      'merchant?: { name?: string; url?: string; };',
      'metadata?: object;',
    ],
    response:
      '{ id?: string; amount_cents?: number; approval_url?: string; attach_url?: string; currency?: string; description?: string; handle?: string; status?: string; }',
    markdown:
      "## create\n\n`client.payments.create(amount_cents: number, currency: string, handle: string, description?: string, merchant?: { name?: string; url?: string; }, metadata?: object): { id?: string; amount_cents?: number; approval_url?: string; attach_url?: string; currency?: string; description?: string; handle?: string; status?: string; }`\n\n**post** `/v3/payments`\n\nAdvances the pay flow for a connected customer handle and returns a\n`status` describing where it is (`needs_connection`, `awaiting_user_action`,\n`ready`, ...). A payment `id` appears once a card is minted. Idempotent on\nthe `Idempotency-Key` header.\n\n\n### Parameters\n\n- `amount_cents: number`\n\n- `currency: string`\n\n- `handle: string`\n  Customer phone (E.164) or email.\n\n- `description?: string`\n\n- `merchant?: { name?: string; url?: string; }`\n  - `name?: string`\n  - `url?: string`\n\n- `metadata?: object`\n\n### Returns\n\n- `{ id?: string; amount_cents?: number; approval_url?: string; attach_url?: string; currency?: string; description?: string; handle?: string; status?: string; }`\n\n  - `id?: string`\n  - `amount_cents?: number`\n  - `approval_url?: string`\n  - `attach_url?: string`\n  - `currency?: string`\n  - `description?: string`\n  - `handle?: string`\n  - `status?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst payment = await client.payments.create({\n  amount_cents: 2500,\n  currency: 'usd',\n  handle: '+14155550123',\n});\n\nconsole.log(payment);\n```",
    perLanguage: {
      go: {
        method: 'client.Payments.New',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpayment, err := client.Payments.New(context.TODO(), linqgo.PaymentNewParams{\n\t\tAmountCents: 2500,\n\t\tCurrency:    "usd",\n\t\tHandle:      "+14155550123",\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", payment.ID)\n}\n',
      },
      python: {
        method: 'payments.create',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment = client.payments.create(\n    amount_cents=2500,\n    currency="usd",\n    handle="+14155550123",\n)\nprint(payment.id)',
      },
      typescript: {
        method: 'client.payments.create',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst payment = await client.payments.create({\n  amount_cents: 2500,\n  currency: 'usd',\n  handle: '+14155550123',\n});\n\nconsole.log(payment.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "amount_cents": 2500,\n          "currency": "usd",\n          "handle": "+14155550123",\n          "description": "Burger order"\n        }\'',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/payments/{paymentId}',
    httpMethod: 'get',
    summary: 'Get a payment',
    description: 'Get a payment',
    stainlessPath: '(resource) payments > (method) retrieve',
    qualified: 'client.payments.retrieve',
    params: ['paymentId: string;'],
    response:
      '{ id?: string; amount_cents?: number; approval_url?: string; attach_url?: string; currency?: string; description?: string; handle?: string; status?: string; }',
    markdown:
      "## retrieve\n\n`client.payments.retrieve(paymentId: string): { id?: string; amount_cents?: number; approval_url?: string; attach_url?: string; currency?: string; description?: string; handle?: string; status?: string; }`\n\n**get** `/v3/payments/{paymentId}`\n\nGet a payment\n\n### Parameters\n\n- `paymentId: string`\n\n### Returns\n\n- `{ id?: string; amount_cents?: number; approval_url?: string; attach_url?: string; currency?: string; description?: string; handle?: string; status?: string; }`\n\n  - `id?: string`\n  - `amount_cents?: number`\n  - `approval_url?: string`\n  - `attach_url?: string`\n  - `currency?: string`\n  - `description?: string`\n  - `handle?: string`\n  - `status?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst payment = await client.payments.retrieve('paymentId');\n\nconsole.log(payment);\n```",
    perLanguage: {
      go: {
        method: 'client.Payments.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpayment, err := client.Payments.Get(context.TODO(), "paymentId")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", payment.ID)\n}\n',
      },
      python: {
        method: 'payments.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment = client.payments.retrieve(\n    "paymentId",\n)\nprint(payment.id)',
      },
      typescript: {
        method: 'client.payments.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst payment = await client.payments.retrieve('paymentId');\n\nconsole.log(payment.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments/$PAYMENT_ID \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'cancel',
    endpoint: '/v3/payments/{paymentId}/cancel',
    httpMethod: 'post',
    summary: 'Cancel a payment',
    description: 'Closes the virtual card and cancels the payment.',
    stainlessPath: '(resource) payments > (method) cancel',
    qualified: 'client.payments.cancel',
    params: ['paymentId: string;'],
    response:
      '{ id?: string; amount_cents?: number; approval_url?: string; attach_url?: string; currency?: string; description?: string; handle?: string; status?: string; }',
    markdown:
      "## cancel\n\n`client.payments.cancel(paymentId: string): { id?: string; amount_cents?: number; approval_url?: string; attach_url?: string; currency?: string; description?: string; handle?: string; status?: string; }`\n\n**post** `/v3/payments/{paymentId}/cancel`\n\nCloses the virtual card and cancels the payment.\n\n### Parameters\n\n- `paymentId: string`\n\n### Returns\n\n- `{ id?: string; amount_cents?: number; approval_url?: string; attach_url?: string; currency?: string; description?: string; handle?: string; status?: string; }`\n\n  - `id?: string`\n  - `amount_cents?: number`\n  - `approval_url?: string`\n  - `attach_url?: string`\n  - `currency?: string`\n  - `description?: string`\n  - `handle?: string`\n  - `status?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst payment = await client.payments.cancel('paymentId');\n\nconsole.log(payment);\n```",
    perLanguage: {
      go: {
        method: 'client.Payments.Cancel',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tpayment, err := client.Payments.Cancel(context.TODO(), "paymentId")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", payment.ID)\n}\n',
      },
      python: {
        method: 'payments.cancel',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\npayment = client.payments.cancel(\n    "paymentId",\n)\nprint(payment.id)',
      },
      typescript: {
        method: 'client.payments.cancel',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst payment = await client.payments.cancel('paymentId');\n\nconsole.log(payment.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments/$PAYMENT_ID/cancel \\\n    -X POST \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'credentials',
    endpoint: '/v3/payments/{paymentId}/credentials',
    httpMethod: 'get',
    summary: "Get a payment's card-reveal handoff",
    description:
      'Returns a short-lived handoff for a `ready` payment. Fetch the card\ncredentials **directly from the provider** with the returned `user_token`\nat `fetch_url` — the card number never passes through Linq. Do not persist\nPAN/CVC.\n',
    stainlessPath: '(resource) payments > (method) credentials',
    qualified: 'client.payments.credentials',
    params: ['paymentId: string;'],
    response:
      '{ handoff?: { card_ref?: string; fetch_url?: string; provider?: string; user_token?: string; }; }',
    markdown:
      "## credentials\n\n`client.payments.credentials(paymentId: string): { handoff?: object; }`\n\n**get** `/v3/payments/{paymentId}/credentials`\n\nReturns a short-lived handoff for a `ready` payment. Fetch the card\ncredentials **directly from the provider** with the returned `user_token`\nat `fetch_url` — the card number never passes through Linq. Do not persist\nPAN/CVC.\n\n\n### Parameters\n\n- `paymentId: string`\n\n### Returns\n\n- `{ handoff?: { card_ref?: string; fetch_url?: string; provider?: string; user_token?: string; }; }`\n\n  - `handoff?: { card_ref?: string; fetch_url?: string; provider?: string; user_token?: string; }`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst response = await client.payments.credentials('paymentId');\n\nconsole.log(response);\n```",
    perLanguage: {
      go: {
        method: 'client.Payments.Credentials',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tresponse, err := client.Payments.Credentials(context.TODO(), "paymentId")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", response.Handoff)\n}\n',
      },
      python: {
        method: 'payments.credentials',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.payments.credentials(\n    "paymentId",\n)\nprint(response.handoff)',
      },
      typescript: {
        method: 'client.payments.credentials',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.payments.credentials('paymentId');\n\nconsole.log(response.handoff);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/payments/$PAYMENT_ID/credentials \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'list',
    endpoint: '/v3/blocked_handles',
    httpMethod: 'get',
    summary: 'List blocked handles',
    description:
      'Returns all handles you have blocked. Inbound messages from a blocked\nhandle are dropped and produce no webhooks, and direct sends to a\nblocked handle are rejected with `403` (error code `2026`). Group\nsends that include unblocked members are not restricted.\n',
    stainlessPath: '(resource) blocked_handles > (method) list',
    qualified: 'client.blockedHandles.list',
    response: '{ blocked_handles: { blocked_at: string; handle: string; reason?: string; }[]; }',
    markdown:
      "## list\n\n`client.blockedHandles.list(): { blocked_handles: blocked_handle_entry[]; }`\n\n**get** `/v3/blocked_handles`\n\nReturns all handles you have blocked. Inbound messages from a blocked\nhandle are dropped and produce no webhooks, and direct sends to a\nblocked handle are rejected with `403` (error code `2026`). Group\nsends that include unblocked members are not restricted.\n\n\n### Returns\n\n- `{ blocked_handles: { blocked_at: string; handle: string; reason?: string; }[]; }`\n\n  - `blocked_handles: { blocked_at: string; handle: string; reason?: string; }[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst blockedHandles = await client.blockedHandles.list();\n\nconsole.log(blockedHandles);\n```",
    perLanguage: {
      go: {
        method: 'client.BlockedHandles.List',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tblockedHandles, err := client.BlockedHandles.List(context.TODO())\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", blockedHandles.BlockedHandles)\n}\n',
      },
      python: {
        method: 'blocked_handles.list',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nblocked_handles = client.blocked_handles.list()\nprint(blocked_handles.blocked_handles)',
      },
      typescript: {
        method: 'client.blockedHandles.list',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst blockedHandles = await client.blockedHandles.list();\n\nconsole.log(blockedHandles.blocked_handles);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/blocked_handles \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'block',
    endpoint: '/v3/blocked_handles',
    httpMethod: 'post',
    summary: 'Block a handle',
    description:
      'Blocks a handle — an E.164 phone number, an email address (iMessage\nsender), an SMS short code (e.g. `262966`), or an alphanumeric sender\nID. Inbound messages from it are dropped and produce no webhooks, and\ndirect sends to it are rejected with `403` (error code `2026`); group\nsends that include unblocked members are not restricted. Blocking is\nidempotent — re-blocking an already blocked handle returns the\nexisting entry.\n',
    stainlessPath: '(resource) blocked_handles > (method) block',
    qualified: 'client.blockedHandles.block',
    params: ['handle: string;', 'reason?: string;'],
    response: '{ blocked_handle: { blocked_at: string; handle: string; reason?: string; }; }',
    markdown:
      "## block\n\n`client.blockedHandles.block(handle: string, reason?: string): { blocked_handle: blocked_handle_entry; }`\n\n**post** `/v3/blocked_handles`\n\nBlocks a handle — an E.164 phone number, an email address (iMessage\nsender), an SMS short code (e.g. `262966`), or an alphanumeric sender\nID. Inbound messages from it are dropped and produce no webhooks, and\ndirect sends to it are rejected with `403` (error code `2026`); group\nsends that include unblocked members are not restricted. Blocking is\nidempotent — re-blocking an already blocked handle returns the\nexisting entry.\n\n\n### Parameters\n\n- `handle: string`\n  The handle to block: an E.164 phone number, an email address, an\nSMS short code (3-8 digits), or an alphanumeric sender ID.\n\n\n- `reason?: string`\n  Optional free-text note on why the handle was blocked\n\n### Returns\n\n- `{ blocked_handle: { blocked_at: string; handle: string; reason?: string; }; }`\n\n  - `blocked_handle: { blocked_at: string; handle: string; reason?: string; }`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst response = await client.blockedHandles.block({ handle: '+12025551234' });\n\nconsole.log(response);\n```",
    perLanguage: {
      go: {
        method: 'client.BlockedHandles.Block',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tresponse, err := client.BlockedHandles.Block(context.TODO(), linqgo.BlockedHandleBlockParams{\n\t\tHandle: "+12025551234",\n\t\tReason: linqgo.String("spam"),\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", response.BlockedHandle)\n}\n',
      },
      python: {
        method: 'blocked_handles.block',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nresponse = client.blocked_handles.block(\n    handle="+12025551234",\n    reason="spam",\n)\nprint(response.blocked_handle)',
      },
      typescript: {
        method: 'client.blockedHandles.block',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst response = await client.blockedHandles.block({ handle: '+12025551234', reason: 'spam' });\n\nconsole.log(response.blocked_handle);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/blocked_handles \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "handle": "+12025551234",\n          "reason": "spam"\n        }\'',
      },
    },
  },
  {
    name: 'unblock',
    endpoint: '/v3/blocked_handles',
    httpMethod: 'delete',
    summary: 'Unblock a handle',
    description:
      'Removes a handle from your blocklist. Inbound messages from it will be\ndelivered again and sends to it are allowed again. The handle goes in\nthe request body, mirroring block — no URL encoding needed.\n',
    stainlessPath: '(resource) blocked_handles > (method) unblock',
    qualified: 'client.blockedHandles.unblock',
    params: ['handle: string;'],
    markdown:
      "## unblock\n\n`client.blockedHandles.unblock(handle: string): void`\n\n**delete** `/v3/blocked_handles`\n\nRemoves a handle from your blocklist. Inbound messages from it will be\ndelivered again and sends to it are allowed again. The handle goes in\nthe request body, mirroring block — no URL encoding needed.\n\n\n### Parameters\n\n- `handle: string`\n  The handle to unblock\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nawait client.blockedHandles.unblock({ handle: '+12025551234' })\n```",
    perLanguage: {
      go: {
        method: 'client.BlockedHandles.Unblock',
        example:
          'package main\n\nimport (\n\t"context"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\terr := client.BlockedHandles.Unblock(context.TODO(), linqgo.BlockedHandleUnblockParams{\n\t\tHandle: "+12025551234",\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n}\n',
      },
      python: {
        method: 'blocked_handles.unblock',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nclient.blocked_handles.unblock(\n    handle="+12025551234",\n)',
      },
      typescript: {
        method: 'client.blockedHandles.unblock',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.blockedHandles.unblock({ handle: '+12025551234' });",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/blocked_handles \\\n    -X DELETE \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'list',
    endpoint: '/v3/experiences',
    httpMethod: 'get',
    summary: 'List experiences you can invoke',
    description:
      'The experiences enabled for your account, with the actions you may\ninvoke on each and the fields each action accepts. This is the\nauthoritative list — an action missing here cannot be sent.\n',
    stainlessPath: '(resource) experiences > (method) list',
    qualified: 'client.experiences.list',
    response:
      '{ experiences?: { actions?: { fields?: object; name?: string; summary?: string; }[]; display_name?: string; experience?: string; }[]; }',
    markdown:
      "## list\n\n`client.experiences.list(): { experiences?: object[]; }`\n\n**get** `/v3/experiences`\n\nThe experiences enabled for your account, with the actions you may\ninvoke on each and the fields each action accepts. This is the\nauthoritative list — an action missing here cannot be sent.\n\n\n### Returns\n\n- `{ experiences?: { actions?: { fields?: object; name?: string; summary?: string; }[]; display_name?: string; experience?: string; }[]; }`\n\n  - `experiences?: { actions?: { fields?: object; name?: string; summary?: string; }[]; display_name?: string; experience?: string; }[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst experiences = await client.experiences.list();\n\nconsole.log(experiences);\n```",
    perLanguage: {
      go: {
        method: 'client.Experiences.List',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\texperiences, err := client.Experiences.List(context.TODO())\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", experiences.Experiences)\n}\n',
      },
      python: {
        method: 'experiences.list',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nexperiences = client.experiences.list()\nprint(experiences.experiences)',
      },
      typescript: {
        method: 'client.experiences.list',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst experiences = await client.experiences.list();\n\nconsole.log(experiences.experiences);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/experiences \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/experiences/{experience}',
    httpMethod: 'get',
    summary: 'Get one experience',
    description: 'Get one experience',
    stainlessPath: '(resource) experiences > (method) retrieve',
    qualified: 'client.experiences.retrieve',
    params: ['experience: string;'],
    response:
      '{ actions?: { fields?: object; name?: string; summary?: string; }[]; display_name?: string; experience?: string; }',
    markdown:
      "## retrieve\n\n`client.experiences.retrieve(experience: string): { actions?: object[]; display_name?: string; experience?: string; }`\n\n**get** `/v3/experiences/{experience}`\n\nGet one experience\n\n### Parameters\n\n- `experience: string`\n\n### Returns\n\n- `{ actions?: { fields?: object; name?: string; summary?: string; }[]; display_name?: string; experience?: string; }`\n  What an experience offers you. Deliberately a projection: where its\ntemplates live and how they are built is not yours to depend on, so it\nis not here.\n\n\n  - `actions?: { fields?: object; name?: string; summary?: string; }[]`\n  - `display_name?: string`\n  - `experience?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst experience = await client.experiences.retrieve('experience');\n\nconsole.log(experience);\n```",
    perLanguage: {
      go: {
        method: 'client.Experiences.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\texperience, err := client.Experiences.Get(context.TODO(), "experience")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", experience.Actions)\n}\n',
      },
      python: {
        method: 'experiences.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nexperience = client.experiences.retrieve(\n    "experience",\n)\nprint(experience.actions)',
      },
      typescript: {
        method: 'client.experiences.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst experience = await client.experiences.retrieve('experience');\n\nconsole.log(experience.actions);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/experiences/$EXPERIENCE \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'list',
    endpoint: '/v3/webhook-events',
    httpMethod: 'get',
    summary: 'List available webhook event types',
    description:
      'Returns all available webhook event types that can be subscribed to.\nUse this endpoint to discover valid values for the `subscribed_events`\nfield when creating or updating webhook subscriptions.\n',
    stainlessPath: '(resource) webhook_events > (method) list',
    qualified: 'client.webhookEvents.list',
    response: "{ doc_url: 'https://docs.linqapp.com/guides/webhooks/events'; events: string[]; }",
    markdown:
      "## list\n\n`client.webhookEvents.list(): { doc_url: 'https://docs.linqapp.com/guides/webhooks/events'; events: webhook_event_type[]; }`\n\n**get** `/v3/webhook-events`\n\nReturns all available webhook event types that can be subscribed to.\nUse this endpoint to discover valid values for the `subscribed_events`\nfield when creating or updating webhook subscriptions.\n\n\n### Returns\n\n- `{ doc_url: 'https://docs.linqapp.com/guides/webhooks/events'; events: string[]; }`\n\n  - `doc_url: 'https://docs.linqapp.com/guides/webhooks/events'`\n  - `events: string[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst webhookEvents = await client.webhookEvents.list();\n\nconsole.log(webhookEvents);\n```",
    perLanguage: {
      go: {
        method: 'client.WebhookEvents.List',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\twebhookEvents, err := client.WebhookEvents.List(context.TODO())\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", webhookEvents.DocURL)\n}\n',
      },
      python: {
        method: 'webhook_events.list',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nwebhook_events = client.webhook_events.list()\nprint(webhook_events.doc_url)',
      },
      typescript: {
        method: 'client.webhookEvents.list',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst webhookEvents = await client.webhookEvents.list();\n\nconsole.log(webhookEvents.doc_url);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/webhook-events \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'create',
    endpoint: '/v3/webhook-subscriptions',
    httpMethod: 'post',
    summary: 'Create a new webhook subscription',
    description:
      'Create a new webhook subscription to receive events at a target URL.\nUpon creation, a signing secret is generated for verifying webhook\nauthenticity. **Store this secret securely — it cannot be retrieved later.**\n\n**Phone Number Filtering:**\n- Optionally specify `phone_numbers` to only receive events for specific lines\n- If omitted, events from all phone numbers are delivered (default behavior)\n- Use multiple subscriptions with different `phone_numbers` to route different lines to different endpoints\n- Each `target_url` can only be used once per account. To route different\n  lines to different destinations, use a unique URL per subscription\n  (e.g., append a query parameter: `https://example.com/webhook?line=1`)\n\n**Webhook Delivery:**\n- Events are sent via HTTP POST to the target URL\n- Each request includes [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks) headers (`webhook-id`, `webhook-timestamp`, `webhook-signature`) for signature verification\n- Legacy `X-Webhook-*` headers are also sent for backwards compatibility (deprecated)\n- See [Verifying Webhook Signatures](https://docs.linqapp.com/guides/webhooks#verifying-webhook-signatures) for verification details\n- Failed deliveries (5xx, 429, network errors) are retried up to 10 times over ~25 minutes with exponential backoff\n- Client errors (4xx except 429) are not retried\n',
    stainlessPath: '(resource) webhook_subscriptions > (method) create',
    qualified: 'client.webhookSubscriptions.create',
    params: ['subscribed_events: string[];', 'target_url: string;', 'phone_numbers?: string[];'],
    response:
      '{ id: string; created_at: string; is_active: boolean; signing_secret: string; subscribed_events: string[]; target_url: string; updated_at: string; phone_numbers?: string[]; }',
    markdown:
      "## create\n\n`client.webhookSubscriptions.create(subscribed_events: string[], target_url: string, phone_numbers?: string[]): { id: string; created_at: string; is_active: boolean; signing_secret: string; subscribed_events: webhook_event_type[]; target_url: string; updated_at: string; phone_numbers?: string[]; }`\n\n**post** `/v3/webhook-subscriptions`\n\nCreate a new webhook subscription to receive events at a target URL.\nUpon creation, a signing secret is generated for verifying webhook\nauthenticity. **Store this secret securely — it cannot be retrieved later.**\n\n**Phone Number Filtering:**\n- Optionally specify `phone_numbers` to only receive events for specific lines\n- If omitted, events from all phone numbers are delivered (default behavior)\n- Use multiple subscriptions with different `phone_numbers` to route different lines to different endpoints\n- Each `target_url` can only be used once per account. To route different\n  lines to different destinations, use a unique URL per subscription\n  (e.g., append a query parameter: `https://example.com/webhook?line=1`)\n\n**Webhook Delivery:**\n- Events are sent via HTTP POST to the target URL\n- Each request includes [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks) headers (`webhook-id`, `webhook-timestamp`, `webhook-signature`) for signature verification\n- Legacy `X-Webhook-*` headers are also sent for backwards compatibility (deprecated)\n- See [Verifying Webhook Signatures](https://docs.linqapp.com/guides/webhooks#verifying-webhook-signatures) for verification details\n- Failed deliveries (5xx, 429, network errors) are retried up to 10 times over ~25 minutes with exponential backoff\n- Client errors (4xx except 429) are not retried\n\n\n### Parameters\n\n- `subscribed_events: string[]`\n  List of event types to subscribe to\n\n- `target_url: string`\n  URL where webhook events will be sent. Must be HTTPS.\n\n- `phone_numbers?: string[]`\n  Optional list of phone numbers to filter events for. Only events originating from these phone numbers will be delivered to this subscription. If omitted or empty, events from all phone numbers are delivered. Phone numbers must be in E.164 format.\n\n### Returns\n\n- `{ id: string; created_at: string; is_active: boolean; signing_secret: string; subscribed_events: string[]; target_url: string; updated_at: string; phone_numbers?: string[]; }`\n  Response returned when creating a webhook subscription. Includes the signing secret which is only shown once.\n\n  - `id: string`\n  - `created_at: string`\n  - `is_active: boolean`\n  - `signing_secret: string`\n  - `subscribed_events: string[]`\n  - `target_url: string`\n  - `updated_at: string`\n  - `phone_numbers?: string[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst webhookSubscription = await client.webhookSubscriptions.create({ subscribed_events: ['message.sent', 'message.delivered', 'message.read'], target_url: 'https://webhooks.example.com/linq/events' });\n\nconsole.log(webhookSubscription);\n```",
    perLanguage: {
      go: {
        method: 'client.WebhookSubscriptions.New',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\twebhookSubscription, err := client.WebhookSubscriptions.New(context.TODO(), linqgo.WebhookSubscriptionNewParams{\n\t\tSubscribedEvents: []linqgo.WebhookEventType{linqgo.WebhookEventTypeMessageSent, linqgo.WebhookEventTypeMessageDelivered, linqgo.WebhookEventTypeMessageRead},\n\t\tTargetURL:        "https://webhooks.example.com/linq/events",\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", webhookSubscription.ID)\n}\n',
      },
      python: {
        method: 'webhook_subscriptions.create',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nwebhook_subscription = client.webhook_subscriptions.create(\n    subscribed_events=["message.sent", "message.delivered", "message.read"],\n    target_url="https://webhooks.example.com/linq/events",\n)\nprint(webhook_subscription.id)',
      },
      typescript: {
        method: 'client.webhookSubscriptions.create',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst webhookSubscription = await client.webhookSubscriptions.create({\n  subscribed_events: ['message.sent', 'message.delivered', 'message.read'],\n  target_url: 'https://webhooks.example.com/linq/events',\n});\n\nconsole.log(webhookSubscription.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/webhook-subscriptions \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "subscribed_events": [\n            "message.sent",\n            "message.delivered",\n            "message.read"\n          ],\n          "target_url": "https://webhooks.example.com/linq/events",\n          "phone_numbers": [\n            "+12025551234",\n            "+12025559876"\n          ]\n        }\'',
      },
    },
  },
  {
    name: 'list',
    endpoint: '/v3/webhook-subscriptions',
    httpMethod: 'get',
    summary: 'List all webhook subscriptions',
    description:
      'Retrieve all webhook subscriptions for the authenticated partner.\nReturns a list of active and inactive subscriptions with their\nconfiguration and status.\n',
    stainlessPath: '(resource) webhook_subscriptions > (method) list',
    qualified: 'client.webhookSubscriptions.list',
    response:
      '{ subscriptions: { id: string; created_at: string; is_active: boolean; subscribed_events: webhook_event_type[]; target_url: string; updated_at: string; phone_numbers?: string[]; }[]; }',
    markdown:
      "## list\n\n`client.webhookSubscriptions.list(): { subscriptions: webhook_subscription[]; }`\n\n**get** `/v3/webhook-subscriptions`\n\nRetrieve all webhook subscriptions for the authenticated partner.\nReturns a list of active and inactive subscriptions with their\nconfiguration and status.\n\n\n### Returns\n\n- `{ subscriptions: { id: string; created_at: string; is_active: boolean; subscribed_events: webhook_event_type[]; target_url: string; updated_at: string; phone_numbers?: string[]; }[]; }`\n\n  - `subscriptions: { id: string; created_at: string; is_active: boolean; subscribed_events: string[]; target_url: string; updated_at: string; phone_numbers?: string[]; }[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst webhookSubscriptions = await client.webhookSubscriptions.list();\n\nconsole.log(webhookSubscriptions);\n```",
    perLanguage: {
      go: {
        method: 'client.WebhookSubscriptions.List',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\twebhookSubscriptions, err := client.WebhookSubscriptions.List(context.TODO())\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", webhookSubscriptions.Subscriptions)\n}\n',
      },
      python: {
        method: 'webhook_subscriptions.list',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nwebhook_subscriptions = client.webhook_subscriptions.list()\nprint(webhook_subscriptions.subscriptions)',
      },
      typescript: {
        method: 'client.webhookSubscriptions.list',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst webhookSubscriptions = await client.webhookSubscriptions.list();\n\nconsole.log(webhookSubscriptions.subscriptions);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/webhook-subscriptions \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/webhook-subscriptions/{subscriptionId}',
    httpMethod: 'get',
    summary: 'Get a webhook subscription by ID',
    description:
      'Retrieve details for a specific webhook subscription including its\ntarget URL, subscribed events, and current status.\n',
    stainlessPath: '(resource) webhook_subscriptions > (method) retrieve',
    qualified: 'client.webhookSubscriptions.retrieve',
    params: ['subscriptionId: string;'],
    response:
      '{ id: string; created_at: string; is_active: boolean; subscribed_events: string[]; target_url: string; updated_at: string; phone_numbers?: string[]; }',
    markdown:
      "## retrieve\n\n`client.webhookSubscriptions.retrieve(subscriptionId: string): { id: string; created_at: string; is_active: boolean; subscribed_events: webhook_event_type[]; target_url: string; updated_at: string; phone_numbers?: string[]; }`\n\n**get** `/v3/webhook-subscriptions/{subscriptionId}`\n\nRetrieve details for a specific webhook subscription including its\ntarget URL, subscribed events, and current status.\n\n\n### Parameters\n\n- `subscriptionId: string`\n\n### Returns\n\n- `{ id: string; created_at: string; is_active: boolean; subscribed_events: string[]; target_url: string; updated_at: string; phone_numbers?: string[]; }`\n\n  - `id: string`\n  - `created_at: string`\n  - `is_active: boolean`\n  - `subscribed_events: string[]`\n  - `target_url: string`\n  - `updated_at: string`\n  - `phone_numbers?: string[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst webhookSubscription = await client.webhookSubscriptions.retrieve('b2c3d4e5-f6a7-8901-bcde-f23456789012');\n\nconsole.log(webhookSubscription);\n```",
    perLanguage: {
      go: {
        method: 'client.WebhookSubscriptions.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\twebhookSubscription, err := client.WebhookSubscriptions.Get(context.TODO(), "b2c3d4e5-f6a7-8901-bcde-f23456789012")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", webhookSubscription.ID)\n}\n',
      },
      python: {
        method: 'webhook_subscriptions.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nwebhook_subscription = client.webhook_subscriptions.retrieve(\n    "b2c3d4e5-f6a7-8901-bcde-f23456789012",\n)\nprint(webhook_subscription.id)',
      },
      typescript: {
        method: 'client.webhookSubscriptions.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst webhookSubscription = await client.webhookSubscriptions.retrieve(\n  'b2c3d4e5-f6a7-8901-bcde-f23456789012',\n);\n\nconsole.log(webhookSubscription.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/webhook-subscriptions/$SUBSCRIPTION_ID \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'update',
    endpoint: '/v3/webhook-subscriptions/{subscriptionId}',
    httpMethod: 'put',
    summary: 'Update a webhook subscription',
    description:
      'Update an existing webhook subscription. You can modify the target URL,\nsubscribed events, or activate/deactivate the subscription.\n\n**Note:** The signing secret cannot be changed via this endpoint.\n',
    stainlessPath: '(resource) webhook_subscriptions > (method) update',
    qualified: 'client.webhookSubscriptions.update',
    params: [
      'subscriptionId: string;',
      'is_active?: boolean;',
      'phone_numbers?: string[];',
      'subscribed_events?: string[];',
      'target_url?: string;',
    ],
    response:
      '{ id: string; created_at: string; is_active: boolean; subscribed_events: string[]; target_url: string; updated_at: string; phone_numbers?: string[]; }',
    markdown:
      "## update\n\n`client.webhookSubscriptions.update(subscriptionId: string, is_active?: boolean, phone_numbers?: string[], subscribed_events?: string[], target_url?: string): { id: string; created_at: string; is_active: boolean; subscribed_events: webhook_event_type[]; target_url: string; updated_at: string; phone_numbers?: string[]; }`\n\n**put** `/v3/webhook-subscriptions/{subscriptionId}`\n\nUpdate an existing webhook subscription. You can modify the target URL,\nsubscribed events, or activate/deactivate the subscription.\n\n**Note:** The signing secret cannot be changed via this endpoint.\n\n\n### Parameters\n\n- `subscriptionId: string`\n\n- `is_active?: boolean`\n  Activate or deactivate the subscription\n\n- `phone_numbers?: string[]`\n  Updated list of phone numbers to filter events for. Set to a non-empty array to filter events to specific phone numbers. Set to an empty array or null to remove the filter and receive events from all phone numbers. Phone numbers must be in E.164 format.\n\n- `subscribed_events?: string[]`\n  Updated list of event types to subscribe to\n\n- `target_url?: string`\n  New target URL for webhook events\n\n### Returns\n\n- `{ id: string; created_at: string; is_active: boolean; subscribed_events: string[]; target_url: string; updated_at: string; phone_numbers?: string[]; }`\n\n  - `id: string`\n  - `created_at: string`\n  - `is_active: boolean`\n  - `subscribed_events: string[]`\n  - `target_url: string`\n  - `updated_at: string`\n  - `phone_numbers?: string[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst webhookSubscription = await client.webhookSubscriptions.update('b2c3d4e5-f6a7-8901-bcde-f23456789012');\n\nconsole.log(webhookSubscription);\n```",
    perLanguage: {
      go: {
        method: 'client.WebhookSubscriptions.Update',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\twebhookSubscription, err := client.WebhookSubscriptions.Update(\n\t\tcontext.TODO(),\n\t\t"b2c3d4e5-f6a7-8901-bcde-f23456789012",\n\t\tlinqgo.WebhookSubscriptionUpdateParams{\n\t\t\tTargetURL: linqgo.String("https://webhooks.example.com/linq/events"),\n\t\t},\n\t)\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", webhookSubscription.ID)\n}\n',
      },
      python: {
        method: 'webhook_subscriptions.update',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nwebhook_subscription = client.webhook_subscriptions.update(\n    subscription_id="b2c3d4e5-f6a7-8901-bcde-f23456789012",\n    target_url="https://webhooks.example.com/linq/events",\n)\nprint(webhook_subscription.id)',
      },
      typescript: {
        method: 'client.webhookSubscriptions.update',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst webhookSubscription = await client.webhookSubscriptions.update(\n  'b2c3d4e5-f6a7-8901-bcde-f23456789012',\n  { target_url: 'https://webhooks.example.com/linq/events' },\n);\n\nconsole.log(webhookSubscription.id);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/webhook-subscriptions/$SUBSCRIPTION_ID \\\n    -X PUT \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "is_active": true,\n          "phone_numbers": [\n            "+12025551234"\n          ],\n          "subscribed_events": [\n            "message.sent",\n            "message.delivered"\n          ],\n          "target_url": "https://webhooks.example.com/linq/events"\n        }\'',
      },
    },
  },
  {
    name: 'delete',
    endpoint: '/v3/webhook-subscriptions/{subscriptionId}',
    httpMethod: 'delete',
    summary: 'Delete a webhook subscription',
    description: 'Delete a webhook subscription.',
    stainlessPath: '(resource) webhook_subscriptions > (method) delete',
    qualified: 'client.webhookSubscriptions.delete',
    params: ['subscriptionId: string;'],
    markdown:
      "## delete\n\n`client.webhookSubscriptions.delete(subscriptionId: string): void`\n\n**delete** `/v3/webhook-subscriptions/{subscriptionId}`\n\nDelete a webhook subscription.\n\n### Parameters\n\n- `subscriptionId: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nawait client.webhookSubscriptions.delete('b2c3d4e5-f6a7-8901-bcde-f23456789012')\n```",
    perLanguage: {
      go: {
        method: 'client.WebhookSubscriptions.Delete',
        example:
          'package main\n\nimport (\n\t"context"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\terr := client.WebhookSubscriptions.Delete(context.TODO(), "b2c3d4e5-f6a7-8901-bcde-f23456789012")\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n}\n',
      },
      python: {
        method: 'webhook_subscriptions.delete',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nclient.webhook_subscriptions.delete(\n    "b2c3d4e5-f6a7-8901-bcde-f23456789012",\n)',
      },
      typescript: {
        method: 'client.webhookSubscriptions.delete',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.webhookSubscriptions.delete('b2c3d4e5-f6a7-8901-bcde-f23456789012');",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/webhook-subscriptions/$SUBSCRIPTION_ID \\\n    -X DELETE \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'check_imessage',
    endpoint: '/v3/capability/check_imessage',
    httpMethod: 'post',
    summary: 'Check iMessage capability',
    description: 'Check whether a recipient address (phone number or email) is reachable via iMessage.\n',
    stainlessPath: '(resource) capability > (method) check_imessage',
    qualified: 'client.capability.checkIMessage',
    params: ['address: string;', 'from?: string;'],
    response: '{ address: string; available: boolean; }',
    markdown:
      "## check_imessage\n\n`client.capability.checkIMessage(address: string, from?: string): { address: string; available: boolean; }`\n\n**post** `/v3/capability/check_imessage`\n\nCheck whether a recipient address (phone number or email) is reachable via iMessage.\n\n\n### Parameters\n\n- `address: string`\n  The recipient phone number or email address to check\n\n- `from?: string`\n  Optional sender phone number. If omitted, an available phone from your pool is used automatically.\n\n### Returns\n\n- `{ address: string; available: boolean; }`\n\n  - `address: string`\n  - `available: boolean`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst handleCheckResponse = await client.capability.checkIMessage({ address: '+15551234567' });\n\nconsole.log(handleCheckResponse);\n```",
    perLanguage: {
      go: {
        method: 'client.Capability.CheckIMessage',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\thandleCheckResponse, err := client.Capability.CheckIMessage(context.TODO(), linqgo.CapabilityCheckIMessageParams{\n\t\tHandleCheck: linqgo.HandleCheckParam{\n\t\t\tAddress: "+15551234567",\n\t\t},\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", handleCheckResponse.Address)\n}\n',
      },
      python: {
        method: 'capability.check_i_message',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nhandle_check_response = client.capability.check_i_message(\n    address="+15551234567",\n)\nprint(handle_check_response.address)',
      },
      typescript: {
        method: 'client.capability.checkIMessage',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst handleCheckResponse = await client.capability.checkIMessage({ address: '+15551234567' });\n\nconsole.log(handleCheckResponse.address);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/capability/check_imessage \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "address": "+15551234567",\n          "from": "+15559876543"\n        }\'',
      },
    },
  },
  {
    name: 'check_rcs',
    endpoint: '/v3/capability/check_rcs',
    httpMethod: 'post',
    summary: 'Check RCS capability',
    description: 'Check whether a recipient address (phone number) supports RCS messaging.\n',
    stainlessPath: '(resource) capability > (method) check_rcs',
    qualified: 'client.capability.checkRCS',
    params: ['address: string;', 'from?: string;'],
    response: '{ address: string; available: boolean; }',
    markdown:
      "## check_rcs\n\n`client.capability.checkRCS(address: string, from?: string): { address: string; available: boolean; }`\n\n**post** `/v3/capability/check_rcs`\n\nCheck whether a recipient address (phone number) supports RCS messaging.\n\n\n### Parameters\n\n- `address: string`\n  The recipient phone number or email address to check\n\n- `from?: string`\n  Optional sender phone number. If omitted, an available phone from your pool is used automatically.\n\n### Returns\n\n- `{ address: string; available: boolean; }`\n\n  - `address: string`\n  - `available: boolean`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst handleCheckResponse = await client.capability.checkRCS({ address: '+15551234567' });\n\nconsole.log(handleCheckResponse);\n```",
    perLanguage: {
      go: {
        method: 'client.Capability.CheckRCS',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\thandleCheckResponse, err := client.Capability.CheckRCS(context.TODO(), linqgo.CapabilityCheckRCSParams{\n\t\tHandleCheck: linqgo.HandleCheckParam{\n\t\t\tAddress: "+15551234567",\n\t\t},\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", handleCheckResponse.Address)\n}\n',
      },
      python: {
        method: 'capability.check_RCS',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nhandle_check_response = client.capability.check_RCS(\n    address="+15551234567",\n)\nprint(handle_check_response.address)',
      },
      typescript: {
        method: 'client.capability.checkRCS',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst handleCheckResponse = await client.capability.checkRCS({ address: '+15551234567' });\n\nconsole.log(handleCheckResponse.address);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/capability/check_rcs \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "address": "+15551234567",\n          "from": "+15559876543"\n        }\'',
      },
    },
  },
  {
    name: 'unwrap',
    endpoint: '',
    httpMethod: '',
    summary: '',
    description: '',
    stainlessPath: '(resource) webhooks > (method) unwrap',
    qualified: 'client.webhooks.unwrap',
    perLanguage: {
      go: {
        method: 'client.Webhooks.Unwrap',
        example:
          'package main\n\nimport (\n\t"context"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\terr := client.Webhooks.Unwrap(context.TODO())\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n}\n',
      },
      python: {
        method: 'webhooks.unwrap',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nclient.webhooks.unwrap()',
      },
      typescript: {
        method: 'client.webhooks.unwrap',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nawait client.webhooks.unwrap();",
      },
    },
  },
  {
    name: 'retrieve',
    endpoint: '/v3/contact_card',
    httpMethod: 'get',
    summary: 'Get contact cards',
    description:
      'Returns the contact card for a specific phone number, or all contact cards for the\nauthenticated partner if no `phone_number` is provided.\n',
    stainlessPath: '(resource) contact_card > (method) retrieve',
    qualified: 'client.contactCard.retrieve',
    params: ['phone_number?: string;'],
    response:
      '{ contact_cards: { first_name: string; is_active: boolean; phone_number: string; image_url?: string; last_name?: string; }[]; }',
    markdown:
      "## retrieve\n\n`client.contactCard.retrieve(phone_number?: string): { contact_cards: object[]; }`\n\n**get** `/v3/contact_card`\n\nReturns the contact card for a specific phone number, or all contact cards for the\nauthenticated partner if no `phone_number` is provided.\n\n\n### Parameters\n\n- `phone_number?: string`\n  E.164 phone number to filter by. If omitted, all my cards for the partner are returned.\n\n### Returns\n\n- `{ contact_cards: { first_name: string; is_active: boolean; phone_number: string; image_url?: string; last_name?: string; }[]; }`\n\n  - `contact_cards: { first_name: string; is_active: boolean; phone_number: string; image_url?: string; last_name?: string; }[]`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst contactCard = await client.contactCard.retrieve();\n\nconsole.log(contactCard);\n```",
    perLanguage: {
      go: {
        method: 'client.ContactCard.Get',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tcontactCard, err := client.ContactCard.Get(context.TODO(), linqgo.ContactCardGetParams{})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", contactCard.ContactCards)\n}\n',
      },
      python: {
        method: 'contact_card.retrieve',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\ncontact_card = client.contact_card.retrieve()\nprint(contact_card.contact_cards)',
      },
      typescript: {
        method: 'client.contactCard.retrieve',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst contactCard = await client.contactCard.retrieve();\n\nconsole.log(contactCard.contact_cards);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/contact_card \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY"',
      },
    },
  },
  {
    name: 'create',
    endpoint: '/v3/contact_card',
    httpMethod: 'post',
    summary: 'Setup contact card',
    description:
      'Creates a contact card for a phone number. This endpoint is intended for initial, one-time setup only.\n\nIf setup does not complete, the response is `500` (`2022`) — call this endpoint again.\n\n**Note:** once a card is active, this endpoint returns `409` (`2014`) so an existing\ncard is never overwritten by accident. Use `PATCH /v3/contact_card` to change it.\n',
    stainlessPath: '(resource) contact_card > (method) create',
    qualified: 'client.contactCard.create',
    params: ['first_name: string;', 'phone_number: string;', 'image_url?: string;', 'last_name?: string;'],
    response:
      '{ first_name: string; is_active: boolean; phone_number: string; image_url?: string; last_name?: string; }',
    markdown:
      "## create\n\n`client.contactCard.create(first_name: string, phone_number: string, image_url?: string, last_name?: string): { first_name: string; is_active: boolean; phone_number: string; image_url?: string; last_name?: string; }`\n\n**post** `/v3/contact_card`\n\nCreates a contact card for a phone number. This endpoint is intended for initial, one-time setup only.\n\nIf setup does not complete, the response is `500` (`2022`) — call this endpoint again.\n\n**Note:** once a card is active, this endpoint returns `409` (`2014`) so an existing\ncard is never overwritten by accident. Use `PATCH /v3/contact_card` to change it.\n\n\n### Parameters\n\n- `first_name: string`\n  First name for the contact card. Required.\n\n- `phone_number: string`\n  E.164 phone number to associate the contact card with\n\n- `image_url?: string`\n  Profile image URL for the contact card.\n\n- `last_name?: string`\n  Last name for the contact card. Optional.\n\n### Returns\n\n- `{ first_name: string; is_active: boolean; phone_number: string; image_url?: string; last_name?: string; }`\n\n  - `first_name: string`\n  - `is_active: boolean`\n  - `phone_number: string`\n  - `image_url?: string`\n  - `last_name?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst setContactCard = await client.contactCard.create({ first_name: 'Acme', phone_number: '+15551234567' });\n\nconsole.log(setContactCard);\n```",
    perLanguage: {
      go: {
        method: 'client.ContactCard.New',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tsetContactCard, err := client.ContactCard.New(context.TODO(), linqgo.ContactCardNewParams{\n\t\tFirstName:   "Acme",\n\t\tPhoneNumber: "+15551234567",\n\t\tImageURL:    linqgo.String("https://cdn.linqapp.com/contact-card/example.jpg"),\n\t\tLastName:    linqgo.String("Support"),\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", setContactCard.FirstName)\n}\n',
      },
      python: {
        method: 'contact_card.create',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nset_contact_card = client.contact_card.create(\n    first_name="Acme",\n    phone_number="+15551234567",\n    image_url="https://cdn.linqapp.com/contact-card/example.jpg",\n    last_name="Support",\n)\nprint(set_contact_card.first_name)',
      },
      typescript: {
        method: 'client.contactCard.create',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst setContactCard = await client.contactCard.create({\n  first_name: 'Acme',\n  phone_number: '+15551234567',\n  image_url: 'https://cdn.linqapp.com/contact-card/example.jpg',\n  last_name: 'Support',\n});\n\nconsole.log(setContactCard.first_name);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/contact_card \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "first_name": "Acme",\n          "phone_number": "+15551234567",\n          "image_url": "https://cdn.linqapp.com/contact-card/example.jpg",\n          "last_name": "Support"\n        }\'',
      },
    },
  },
  {
    name: 'update',
    endpoint: '/v3/contact_card',
    httpMethod: 'patch',
    summary: 'Update contact card',
    description:
      'Partially updates the contact card for a phone number.\n\nFetches the current contact card and merges the provided fields.\nOnly fields present in the request body are updated; omitted fields retain their existing values.\n\nIf the update does not complete, the response is `500` (`2022`) — call this endpoint again.\n',
    stainlessPath: '(resource) contact_card > (method) update',
    qualified: 'client.contactCard.update',
    params: ['phone_number: string;', 'first_name?: string;', 'image_url?: string;', 'last_name?: string;'],
    response:
      '{ first_name: string; is_active: boolean; phone_number: string; image_url?: string; last_name?: string; }',
    markdown:
      "## update\n\n`client.contactCard.update(phone_number: string, first_name?: string, image_url?: string, last_name?: string): { first_name: string; is_active: boolean; phone_number: string; image_url?: string; last_name?: string; }`\n\n**patch** `/v3/contact_card`\n\nPartially updates the contact card for a phone number.\n\nFetches the current contact card and merges the provided fields.\nOnly fields present in the request body are updated; omitted fields retain their existing values.\n\nIf the update does not complete, the response is `500` (`2022`) — call this endpoint again.\n\n\n### Parameters\n\n- `phone_number: string`\n  E.164 phone number of the contact card to update\n\n- `first_name?: string`\n  Updated first name. If omitted, the existing value is kept.\n\n- `image_url?: string`\n  Updated profile image URL. If omitted, the existing image is kept.\n\n- `last_name?: string`\n  Updated last name. If omitted, the existing value is kept.\n\n### Returns\n\n- `{ first_name: string; is_active: boolean; phone_number: string; image_url?: string; last_name?: string; }`\n\n  - `first_name: string`\n  - `is_active: boolean`\n  - `phone_number: string`\n  - `image_url?: string`\n  - `last_name?: string`\n\n### Example\n\n```typescript\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3();\n\nconst setContactCard = await client.contactCard.update({ phone_number: '+15551234567' });\n\nconsole.log(setContactCard);\n```",
    perLanguage: {
      go: {
        method: 'client.ContactCard.Update',
        example:
          'package main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"),\n\t)\n\tsetContactCard, err := client.ContactCard.Update(context.TODO(), linqgo.ContactCardUpdateParams{\n\t\tPhoneNumber: "+15551234567",\n\t\tFirstName:   linqgo.String("John"),\n\t\tImageURL:    linqgo.String("https://cdn.linqapp.com/contact-card/example.jpg"),\n\t\tLastName:    linqgo.String("Doe"),\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", setContactCard.FirstName)\n}\n',
      },
      python: {
        method: 'contact_card.update',
        example:
          'import os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\nset_contact_card = client.contact_card.update(\n    phone_number="+15551234567",\n    first_name="John",\n    image_url="https://cdn.linqapp.com/contact-card/example.jpg",\n    last_name="Doe",\n)\nprint(set_contact_card.first_name)',
      },
      typescript: {
        method: 'client.contactCard.update',
        example:
          "import LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst setContactCard = await client.contactCard.update({\n  phone_number: '+15551234567',\n  first_name: 'John',\n  image_url: 'https://cdn.linqapp.com/contact-card/example.jpg',\n  last_name: 'Doe',\n});\n\nconsole.log(setContactCard.first_name);",
      },
      http: {
        example:
          'curl https://api.linqapp.com/api/partner/v3/contact_card \\\n    -X PATCH \\\n    -H \'Content-Type: application/json\' \\\n    -H "Authorization: Bearer $LINQ_API_V3_API_KEY" \\\n    -d \'{\n          "first_name": "John",\n          "image_url": "https://cdn.linqapp.com/contact-card/example.jpg",\n          "last_name": "Doe"\n        }\'',
      },
    },
  },
];

const EMBEDDED_READMES: { language: string; content: string }[] = [
  {
    language: 'go',
    content:
      '# Linq API V3 Go API Library\n\n<a href="https://pkg.go.dev/github.com/linq-team/linq-go"><img src="https://pkg.go.dev/badge/github.com/linq-team/linq-go.svg" alt="Go Reference"></a>\n\nThe Linq API V3 Go library provides convenient access to the [Linq API V3 REST API](https://docs.linqapp.com)\nfrom applications written in Go.\n\nIt is generated with [Stainless](https://www.stainless.com/).\n\n## MCP Server\n\nUse the Linq API V3 MCP Server to enable AI assistants to interact with this API, allowing them to explore endpoints, make test requests, and use documentation to help integrate this SDK into your application.\n\n[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=%40linqapp%2Fsdk-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBsaW5xYXBwL3Nkay1tY3AiXSwiZW52Ijp7IkxJTlFfQVBJX1YzX0FQSV9LRVkiOiJNeSBBUEkgS2V5IiwiTElOUV9XRUJIT09LX1NFQ1JFVCI6Ik15IFdlYmhvb2sgU2VjcmV0In19)\n[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22%40linqapp%2Fsdk-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40linqapp%2Fsdk-mcp%22%5D%2C%22env%22%3A%7B%22LINQ_API_V3_API_KEY%22%3A%22My%20API%20Key%22%2C%22LINQ_WEBHOOK_SECRET%22%3A%22My%20Webhook%20Secret%22%7D%7D)\n\n> Note: You may need to set environment variables in your MCP client.\n\n## Installation\n\n<!-- x-release-please-start-version -->\n\n```go\nimport (\n\t"github.com/linq-team/linq-go" // imported as SDK_PackageName\n)\n```\n\n<!-- x-release-please-end -->\n\nOr to pin the version:\n\n<!-- x-release-please-start-version -->\n\n```sh\ngo get -u \'github.com/linq-team/linq-go@v0.30.0\'\n```\n\n<!-- x-release-please-end -->\n\n## Requirements\n\nThis library requires Go 1.22+.\n\n## Usage\n\nThe full API of this library can be found in [api.md](api.md).\n\n```go\npackage main\n\nimport (\n\t"context"\n\t"fmt"\n\n\t"github.com/linq-team/linq-go"\n\t"github.com/linq-team/linq-go/option"\n)\n\nfunc main() {\n\tclient := linqgo.NewClient(\n\t\toption.WithAPIKey("My API Key"), // defaults to os.LookupEnv("LINQ_API_V3_API_KEY")\n\t)\n\tchat, err := client.Chats.New(context.TODO(), linqgo.ChatNewParams{\n\t\tFrom:    "+12052535597",\n\t\tMessage: linqgo.MessageContentParam{},\n\t\tTo:      []string{"+12052532136"},\n\t})\n\tif err != nil {\n\t\tpanic(err.Error())\n\t}\n\tfmt.Printf("%+v\\n", chat.Chat)\n}\n\n```\n\n### Request fields\n\nAll request parameters are wrapped in a generic `Field` type,\nwhich we use to distinguish zero values from null or omitted fields.\n\nThis prevents accidentally sending a zero value if you forget a required parameter,\nand enables explicitly sending `null`, `false`, `\'\'`, or `0` on optional parameters.\nAny field not specified is not sent.\n\nTo construct fields with values, use the helpers `String()`, `Int()`, `Float()`, or most commonly, the generic `F[T]()`.\nTo send a null, use `Null[T]()`, and to send a nonconforming value, use `Raw[T](any)`. For example:\n\n```go\nparams := FooParams{\n\tName: SDK_PackageName.F("hello"),\n\n\t// Explicitly send `"description": null`\n\tDescription: SDK_PackageName.Null[string](),\n\n\tPoint: SDK_PackageName.F(SDK_PackageName.Point{\n\t\tX: SDK_PackageName.Int(0),\n\t\tY: SDK_PackageName.Int(1),\n\n\t\t// In cases where the API specifies a given type,\n\t\t// but you want to send something else, use `Raw`:\n\t\tZ: SDK_PackageName.Raw[int64](0.01), // sends a float\n\t}),\n}\n```\n\n### Response objects\n\nAll fields in response structs are value types (not pointers or wrappers).\n\nIf a given field is `null`, not present, or invalid, the corresponding field\nwill simply be its zero value.\n\nAll response structs also include a special `JSON` field, containing more detailed\ninformation about each property, which you can use like so:\n\n```go\nif res.Name == "" {\n\t// true if `"name"` is either not present or explicitly null\n\tres.JSON.Name.IsNull()\n\n\t// true if the `"name"` key was not present in the response JSON at all\n\tres.JSON.Name.IsMissing()\n\n\t// When the API returns data that cannot be coerced to the expected type:\n\tif res.JSON.Name.IsInvalid() {\n\t\traw := res.JSON.Name.Raw()\n\n\t\tlegacyName := struct{\n\t\t\tFirst string `json:"first"`\n\t\t\tLast  string `json:"last"`\n\t\t}{}\n\t\tjson.Unmarshal([]byte(raw), &legacyName)\n\t\tname = legacyName.First + " " + legacyName.Last\n\t}\n}\n```\n\nThese `.JSON` structs also include an `Extras` map containing\nany properties in the json response that were not specified\nin the struct. This can be useful for API features not yet\npresent in the SDK.\n\n```go\nbody := res.JSON.ExtraFields["my_unexpected_field"].Raw()\n```\n\n### RequestOptions\n\nThis library uses the functional options pattern. Functions defined in the\n`SDK_PackageOptionName` package return a `RequestOption`, which is a closure that mutates a\n`RequestConfig`. These options can be supplied to the client or at individual\nrequests. For example:\n\n```go\nclient := SDK_PackageName.SDK_ClientInitializerName(\n\t// Adds a header to every request made by the client\n\tSDK_PackageOptionName.WithHeader("X-Some-Header", "custom_header_info"),\n)\n\nclient.Chats.New(context.TODO(), ...,\n\t// Override the header\n\tSDK_PackageOptionName.WithHeader("X-Some-Header", "some_other_custom_header_info"),\n\t// Add an undocumented field to the request body, using sjson syntax\n\tSDK_PackageOptionName.WithJSONSet("some.json.path", map[string]string{"my": "object"}),\n)\n```\n\nSee the [full list of request options](https://pkg.go.dev/github.com/linq-team/linq-go/SDK_PackageOptionName).\n\n### Pagination\n\nThis library provides some conveniences for working with paginated list endpoints.\n\nYou can use `.ListAutoPaging()` methods to iterate through items across all pages:\n\n```go\niter := client.Chats.ListChatsAutoPaging(context.TODO(), linqgo.ChatListChatsParams{})\n// Automatically fetches more pages as needed.\nfor iter.Next() {\n\tchat := iter.Current()\n\tfmt.Printf("%+v\\n", chat)\n}\nif err := iter.Err(); err != nil {\n\tpanic(err.Error())\n}\n```\n\nOr you can use simple `.List()` methods to fetch a single page and receive a standard response object\nwith additional helper methods like `.GetNextPage()`, e.g.:\n\n```go\npage, err := client.Chats.ListChats(context.TODO(), linqgo.ChatListChatsParams{})\nfor page != nil {\n\tfor _, chat := range page.Chats {\n\t\tfmt.Printf("%+v\\n", chat)\n\t}\n\tpage, err = page.GetNextPage()\n}\nif err != nil {\n\tpanic(err.Error())\n}\n```\n\n### Errors\n\nWhen the API returns a non-success status code, we return an error with type\n`*SDK_PackageName.Error`. This contains the `StatusCode`, `*http.Request`, and\n`*http.Response` values of the request, as well as the JSON of the error body\n(much like other response objects in the SDK).\n\nTo handle errors, we recommend that you use the `errors.As` pattern:\n\n```go\n_, err := client.Chats.New(context.TODO(), linqgo.ChatNewParams{\n\tFrom:    "+12052535597",\n\tMessage: linqgo.MessageContentParam{},\n\tTo:      []string{"+12052532136"},\n})\nif err != nil {\n\tvar apierr *linqgo.Error\n\tif errors.As(err, &apierr) {\n\t\tprintln(string(apierr.DumpRequest(true)))  // Prints the serialized HTTP request\n\t\tprintln(string(apierr.DumpResponse(true))) // Prints the serialized HTTP response\n\t}\n\tpanic(err.Error()) // GET "/v3/chats": 400 Bad Request { ... }\n}\n```\n\nWhen other errors occur, they are returned unwrapped; for example,\nif HTTP transport fails, you might receive `*url.Error` wrapping `*net.OpError`.\n\n### Timeouts\n\nRequests do not time out by default; use context to configure a timeout for a request lifecycle.\n\nNote that if a request is [retried](#retries), the context timeout does not start over.\nTo set a per-retry timeout, use `SDK_PackageOptionName.WithRequestTimeout()`.\n\n```go\n// This sets the timeout for the request, including all the retries.\nctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)\ndefer cancel()\nclient.Chats.New(\n\tctx,\n\tlinqgo.ChatNewParams{\n\t\tFrom:    "+12052535597",\n\t\tMessage: linqgo.MessageContentParam{},\n\t\tTo:      []string{"+12052532136"},\n\t},\n\t// This sets the per-retry timeout\n\toption.WithRequestTimeout(20*time.Second),\n)\n```\n\n### File uploads\n\nRequest parameters that correspond to file uploads in multipart requests are typed as\n`param.Field[io.Reader]`. The contents of the `io.Reader` will by default be sent as a multipart form\npart with the file name of "anonymous_file" and content-type of "application/octet-stream".\n\nThe file name and content-type can be customized by implementing `Name() string` or `ContentType()\nstring` on the run-time type of `io.Reader`. Note that `os.File` implements `Name() string`, so a\nfile returned by `os.Open` will be sent with the file name on disk.\n\nWe also provide a helper `SDK_PackageName.FileParam(reader io.Reader, filename string, contentType string)`\nwhich can be used to wrap any `io.Reader` with the appropriate file name and content type.\n\n\n\n### Retries\n\nCertain errors will be automatically retried 2 times by default, with a short exponential backoff.\nWe retry by default all connection errors, 408 Request Timeout, 409 Conflict, 429 Rate Limit,\nand >=500 Internal errors.\n\nYou can use the `WithMaxRetries` option to configure or disable this:\n\n```go\n// Configure the default for all requests:\nclient := linqgo.NewClient(\n\toption.WithMaxRetries(0), // default is 2\n)\n\n// Override per-request:\nclient.Chats.New(\n\tcontext.TODO(),\n\tlinqgo.ChatNewParams{\n\t\tFrom:    "+12052535597",\n\t\tMessage: linqgo.MessageContentParam{},\n\t\tTo:      []string{"+12052532136"},\n\t},\n\toption.WithMaxRetries(5),\n)\n```\n\n\n### Accessing raw response data (e.g. response headers)\n\nYou can access the raw HTTP response data by using the `option.WithResponseInto()` request option. This is useful when\nyou need to examine response headers, status codes, or other details.\n\n```go\n// Create a variable to store the HTTP response\nvar response *http.Response\nchat, err := client.Chats.New(\n\tcontext.TODO(),\n\tlinqgo.ChatNewParams{\n\t\tFrom:    "+12052535597",\n\t\tMessage: linqgo.MessageContentParam{},\n\t\tTo:      []string{"+12052532136"},\n\t},\n\toption.WithResponseInto(&response),\n)\nif err != nil {\n\t// handle error\n}\nfmt.Printf("%+v\\n", chat)\n\nfmt.Printf("Status Code: %d\\n", response.StatusCode)\nfmt.Printf("Headers: %+#v\\n", response.Header)\n```\n\n### Making custom/undocumented requests\n\nThis library is typed for convenient access to the documented API. If you need to access undocumented\nendpoints, params, or response properties, the library can still be used.\n\n#### Undocumented endpoints\n\nTo make requests to undocumented endpoints, you can use `client.Get`, `client.Post`, and other HTTP verbs.\n`RequestOptions` on the client, such as retries, will be respected when making these requests.\n\n```go\nvar (\n    // params can be an io.Reader, a []byte, an encoding/json serializable object,\n    // or a "…Params" struct defined in this library.\n    params map[string]interface{}\n\n    // result can be an []byte, *http.Response, a encoding/json deserializable object,\n    // or a model defined in this library.\n    result *http.Response\n)\nerr := client.Post(context.Background(), "/unspecified", params, &result)\nif err != nil {\n    …\n}\n```\n\n#### Undocumented request params\n\nTo make requests using undocumented parameters, you may use either the `SDK_PackageOptionName.WithQuerySet()`\nor the `SDK_PackageOptionName.WithJSONSet()` methods.\n\n```go\nparams := FooNewParams{\n    ID:   SDK_PackageName.F("id_xxxx"),\n    Data: SDK_PackageName.F(FooNewParamsData{\n        FirstName: SDK_PackageName.F("John"),\n    }),\n}\nclient.Foo.New(context.Background(), params, SDK_PackageOptionName.WithJSONSet("data.last_name", "Doe"))\n```\n\n#### Undocumented response properties\n\nTo access undocumented response properties, you may either access the raw JSON of the response as a string\nwith `result.JSON.RawJSON()`, or get the raw JSON of a particular field on the result with\n`result.JSON.Foo.Raw()`.\n\nAny fields that are not present on the response struct will be saved and can be accessed by `result.JSON.ExtraFields()` which returns the extra fields as a `map[string]Field`.\n\n### Middleware\n\nWe provide `SDK_PackageOptionName.WithMiddleware` which applies the given\nmiddleware to requests.\n\n```go\nfunc Logger(req *http.Request, next SDK_PackageOptionName.MiddlewareNext) (res *http.Response, err error) {\n\t// Before the request\n\tstart := time.Now()\n\tLogReq(req)\n\n\t// Forward the request to the next handler\n\tres, err = next(req)\n\n\t// Handle stuff after the request\n\tend := time.Now()\n\tLogRes(res, err, start - end)\n\n    return res, err\n}\n\nclient := SDK_PackageName.SDK_ClientInitializerName(\n\tSDK_PackageOptionName.WithMiddleware(Logger),\n)\n```\n\nWhen multiple middlewares are provided as variadic arguments, the middlewares\nare applied left to right. If `SDK_PackageOptionName.WithMiddleware` is given\nmultiple times, for example first in the client then the method, the\nmiddleware in the client will run first and the middleware given in the method\nwill run next.\n\nYou may also replace the default `http.Client` with\n`SDK_PackageOptionName.WithHTTPClient(client)`. Only one http client is\naccepted (this overwrites any previous client) and receives requests after any\nmiddleware has been applied.\n\n## Semantic versioning\n\nThis package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:\n\n1. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_\n2. Changes that we do not expect to impact the vast majority of users in practice.\n\nWe take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.\n\nWe are keen for your feedback; please open an [issue](https://www.github.com/linq-team/linq-go/issues) with questions, bugs, or suggestions.\n\n## Contributing\n\nSee [the contributing documentation](./CONTRIBUTING.md).\n',
  },
  {
    language: 'python',
    content:
      '# Linq API V3 Python API library\n\n<!-- prettier-ignore -->\n[![PyPI version](https://img.shields.io/pypi/v/linq-python.svg?label=pypi%20(stable))](https://pypi.org/project/linq-python/)\n\nThe Linq API V3 Python library provides convenient access to the Linq API V3 REST API from any Python 3.9+\napplication. The library includes type definitions for all request params and response fields,\nand offers both synchronous and asynchronous clients powered by [httpx](https://github.com/encode/httpx).\n\n\n\nIt is generated with [Stainless](https://www.stainless.com/).\n\n## MCP Server\n\nUse the Linq API V3 MCP Server to enable AI assistants to interact with this API, allowing them to explore endpoints, make test requests, and use documentation to help integrate this SDK into your application.\n\n[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=%40linqapp%2Fsdk-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBsaW5xYXBwL3Nkay1tY3AiXSwiZW52Ijp7IkxJTlFfQVBJX1YzX0FQSV9LRVkiOiJNeSBBUEkgS2V5IiwiTElOUV9XRUJIT09LX1NFQ1JFVCI6Ik15IFdlYmhvb2sgU2VjcmV0In19)\n[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22%40linqapp%2Fsdk-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40linqapp%2Fsdk-mcp%22%5D%2C%22env%22%3A%7B%22LINQ_API_V3_API_KEY%22%3A%22My%20API%20Key%22%2C%22LINQ_WEBHOOK_SECRET%22%3A%22My%20Webhook%20Secret%22%7D%7D)\n\n> Note: You may need to set environment variables in your MCP client.\n\n## Documentation\n\nThe REST API documentation can be found on [docs.linqapp.com](https://docs.linqapp.com). The full API of this library can be found in [api.md](api.md).\n\n## Installation\n\n```sh\n# install from PyPI\npip install linq-python\n```\n\n## Usage\n\nThe full API of this library can be found in [api.md](api.md).\n\n```python\nimport os\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\n\nchat = client.chats.create(\n    from_="+12052535597",\n    message={},\n    to=["+12052532136"],\n)\nprint(chat.chat)\n```\n\nWhile you can provide an `api_key` keyword argument,\nwe recommend using [python-dotenv](https://pypi.org/project/python-dotenv/)\nto add `LINQ_API_V3_API_KEY="My API Key"` to your `.env` file\nso that your API Key is not stored in source control.\n\n## Async usage\n\nSimply import `AsyncLinqAPIV3` instead of `LinqAPIV3` and use `await` with each API call:\n\n```python\nimport os\nimport asyncio\nfrom linq import AsyncLinqAPIV3\n\nclient = AsyncLinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n)\n\nasync def main() -> None:\n  chat = await client.chats.create(\n      from_="+12052535597",\n      message={},\n      to=["+12052532136"],\n  )\n  print(chat.chat)\n\nasyncio.run(main())\n```\n\nFunctionality between the synchronous and asynchronous clients is otherwise identical.\n\n### With aiohttp\n\nBy default, the async client uses `httpx` for HTTP requests. However, for improved concurrency performance you may also use `aiohttp` as the HTTP backend.\n\nYou can enable this by installing `aiohttp`:\n\n```sh\n# install from PyPI\npip install linq-python[aiohttp]\n```\n\nThen you can enable it by instantiating the client with `http_client=DefaultAioHttpClient()`:\n\n```python\nimport os\nimport asyncio\nfrom linq import DefaultAioHttpClient\nfrom linq import AsyncLinqAPIV3\n\nasync def main() -> None:\n  async with AsyncLinqAPIV3(\n    api_key=os.environ.get("LINQ_API_V3_API_KEY"),  # This is the default and can be omitted\n    http_client=DefaultAioHttpClient(),\n) as client:\n    chat = await client.chats.create(\n        from_="+12052535597",\n        message={},\n        to=["+12052532136"],\n    )\n    print(chat.chat)\n\nasyncio.run(main())\n```\n\n\n\n## Using types\n\nNested request parameters are [TypedDicts](https://docs.python.org/3/library/typing.html#typing.TypedDict). Responses are [Pydantic models](https://docs.pydantic.dev) which also provide helper methods for things like:\n\n- Serializing back into JSON, `model.to_json()`\n- Converting to a dictionary, `model.to_dict()`\n\nTyped requests and responses provide autocomplete and documentation within your editor. If you would like to see type errors in VS Code to help catch bugs earlier, set `python.analysis.typeCheckingMode` to `basic`.\n\n## Pagination\n\nList methods in the Linq API V3 API are paginated.\n\nThis library provides auto-paginating iterators with each list response, so you do not have to request successive pages manually:\n\n```python\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3()\n\nall_chats = []\n# Automatically fetches more pages as needed.\nfor chat in client.chats.list_chats():\n    # Do something with chat here\n    all_chats.append(chat)\nprint(all_chats)\n```\n\nOr, asynchronously:\n\n```python\nimport asyncio\nfrom linq import AsyncLinqAPIV3\n\nclient = AsyncLinqAPIV3()\n\nasync def main() -> None:\n    all_chats = []\n    # Iterate through items across all pages, issuing requests as needed.\n    async for chat in client.chats.list_chats():\n        all_chats.append(chat)\n    print(all_chats)\n\nasyncio.run(main())\n```\n\nAlternatively, you can use the `.has_next_page()`, `.next_page_info()`, or  `.get_next_page()` methods for more granular control working with pages:\n\n```python\nfirst_page = await client.chats.list_chats()\nif first_page.has_next_page():\n    print(f"will fetch next page using these details: {first_page.next_page_info()}")\n    next_page = await first_page.get_next_page()\n    print(f"number of items we just fetched: {len(next_page.chats)}")\n\n# Remove `await` for non-async usage.\n```\n\nOr just work directly with the returned data:\n\n```python\nfirst_page = await client.chats.list_chats()\n\nprint(f"next page cursor: {first_page.next_cursor}") # => "next page cursor: ..."\nfor chat in first_page.chats:\n    print(chat.id)\n\n# Remove `await` for non-async usage.\n```\n\n## Nested params\n\nNested parameters are dictionaries, typed using `TypedDict`, for example:\n\n```python\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3()\n\nchat = client.chats.create(\n    from_="+12052535597",\n    message={\n        "parts": [{\n            "type": "text",\n            "value": "Hello! How can I help you today?",\n        }]\n    },\n    to=["+12052532136"],\n)\nprint(chat.message)\n```\n\n\n\n## Handling errors\n\nWhen the library is unable to connect to the API (for example, due to network connection problems or a timeout), a subclass of `linq.APIConnectionError` is raised.\n\nWhen the API returns a non-success status code (that is, 4xx or 5xx\nresponse), a subclass of `linq.APIStatusError` is raised, containing `status_code` and `response` properties.\n\nAll errors inherit from `linq.APIError`.\n\n```python\nimport linq\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3()\n\ntry:\n    client.chats.create(\n        from_="+12052535597",\n        message={},\n        to=["+12052532136"],\n    )\nexcept linq.APIConnectionError as e:\n    print("The server could not be reached")\n    print(e.__cause__) # an underlying Exception, likely raised within httpx.\nexcept linq.RateLimitError as e:\n    print("A 429 status code was received; we should back off a bit.")\nexcept linq.APIStatusError as e:\n    print("Another non-200-range status code was received")\n    print(e.status_code)\n    print(e.response)\n```\n\nError codes are as follows:\n\n| Status Code | Error Type                 |\n| ----------- | -------------------------- |\n| 400         | `BadRequestError`          |\n| 401         | `AuthenticationError`      |\n| 403         | `PermissionDeniedError`    |\n| 404         | `NotFoundError`            |\n| 422         | `UnprocessableEntityError` |\n| 429         | `RateLimitError`           |\n| >=500       | `InternalServerError`      |\n| N/A         | `APIConnectionError`       |\n\n### Retries\n\nCertain errors are automatically retried 2 times by default, with a short exponential backoff.\nConnection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,\n429 Rate Limit, and >=500 Internal errors are all retried by default.\n\nYou can use the `max_retries` option to configure or disable retry settings:\n\n```python\nfrom linq import LinqAPIV3\n\n# Configure the default for all requests:\nclient = LinqAPIV3(\n    # default is 2\n    max_retries=0,\n)\n\n# Or, configure per-request:\nclient.with_options(max_retries = 5).chats.create(\n    from_="+12052535597",\n    message={},\n    to=["+12052532136"],\n)\n```\n\n### Timeouts\n\nBy default requests time out after 1 minute. You can configure this with a `timeout` option,\nwhich accepts a float or an [`httpx.Timeout`](https://www.python-httpx.org/advanced/timeouts/#fine-tuning-the-configuration) object:\n\n```python\nfrom linq import LinqAPIV3\n\n# Configure the default for all requests:\nclient = LinqAPIV3(\n    # 20 seconds (default is 1 minute)\n    timeout=20.0,\n)\n\n# More granular control:\nclient = LinqAPIV3(\n    timeout=httpx.Timeout(60.0, read=5.0, write=10.0, connect=2.0),\n)\n\n# Override per-request:\nclient.with_options(timeout = 5.0).chats.create(\n    from_="+12052535597",\n    message={},\n    to=["+12052532136"],\n)\n```\n\nOn timeout, an `APITimeoutError` is thrown.\n\nNote that requests that time out are [retried twice by default](#retries).\n\n\n\n## Advanced\n\n### Logging\n\nWe use the standard library [`logging`](https://docs.python.org/3/library/logging.html) module.\n\nYou can enable logging by setting the environment variable `LINQ_API_V3_LOG` to `info`.\n\n```shell\n$ export LINQ_API_V3_LOG=info\n```\n\nOr to `debug` for more verbose logging.\n\n### How to tell whether `None` means `null` or missing\n\nIn an API response, a field may be explicitly `null`, or missing entirely; in either case, its value is `None` in this library. You can differentiate the two cases with `.model_fields_set`:\n\n```py\nif response.my_field is None:\n  if \'my_field\' not in response.model_fields_set:\n    print(\'Got json like {}, without a "my_field" key present at all.\')\n  else:\n    print(\'Got json like {"my_field": null}.\')\n```\n\n### Accessing raw response data (e.g. headers)\n\nThe "raw" Response object can be accessed by prefixing `.with_raw_response.` to any HTTP method call, e.g.,\n\n```py\nfrom linq import LinqAPIV3\n\nclient = LinqAPIV3()\nresponse = client.chats.with_raw_response.create(\n    from_="+12052535597",\n    message={},\n    to=["+12052532136"],\n)\nprint(response.headers.get(\'X-My-Header\'))\n\nchat = response.parse()  # get the object that `chats.create()` would have returned\nprint(chat.chat)\n```\n\nThese methods return an [`APIResponse`](https://github.com/linq-team/linq-python/tree/main/src/linq/_response.py) object.\n\nThe async client returns an [`AsyncAPIResponse`](https://github.com/linq-team/linq-python/tree/main/src/linq/_response.py) with the same structure, the only difference being `await`able methods for reading the response content.\n\n#### `.with_streaming_response`\n\nThe above interface eagerly reads the full response body when you make the request, which may not always be what you want.\n\nTo stream the response body, use `.with_streaming_response` instead, which requires a context manager and only reads the response body once you call `.read()`, `.text()`, `.json()`, `.iter_bytes()`, `.iter_text()`, `.iter_lines()` or `.parse()`. In the async client, these are async methods.\n\n```python\nwith client.chats.with_streaming_response.create(\n    from_="+12052535597",\n    message={},\n    to=["+12052532136"],\n) as response :\n    print(response.headers.get(\'X-My-Header\'))\n\n    for line in response.iter_lines():\n      print(line)\n```\n\nThe context manager is required so that the response will reliably be closed.\n\n### Making custom/undocumented requests\n\nThis library is typed for convenient access to the documented API.\n\nIf you need to access undocumented endpoints, params, or response properties, the library can still be used.\n\n#### Undocumented endpoints\n\nTo make requests to undocumented endpoints, you can make requests using `client.get`, `client.post`, and other\nhttp verbs. Options on the client will be respected (such as retries) when making this request.\n\n```py\nimport httpx\n\nresponse = client.post(\n    "/foo",\n    cast_to=httpx.Response,\n    body={"my_param": True},\n)\n\nprint(response.headers.get("x-foo"))\n```\n\n#### Undocumented request params\n\nIf you want to explicitly send an extra param, you can do so with the `extra_query`, `extra_body`, and `extra_headers` request\noptions.\n\n#### Undocumented response properties\n\nTo access undocumented response properties, you can access the extra fields like `response.unknown_prop`. You\ncan also get all the extra fields on the Pydantic model as a dict with\n[`response.model_extra`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.BaseModel.model_extra).\n\n### Configuring the HTTP client\n\nYou can directly override the [httpx client](https://www.python-httpx.org/api/#client) to customize it for your use case, including:\n\n- Support for [proxies](https://www.python-httpx.org/advanced/proxies/)\n- Custom [transports](https://www.python-httpx.org/advanced/transports/)\n- Additional [advanced](https://www.python-httpx.org/advanced/clients/) functionality\n\n```python\nimport httpx\nfrom linq import LinqAPIV3, DefaultHttpxClient\n\nclient = LinqAPIV3(\n    # Or use the `LINQ_API_V3_BASE_URL` env var\n    base_url="http://my.test.server.example.com:8083",\n    http_client=DefaultHttpxClient(proxy="http://my.test.proxy.example.com", transport=httpx.HTTPTransport(local_address="0.0.0.0")),\n)\n```\n\nYou can also customize the client on a per-request basis by using `with_options()`:\n\n```python\nclient.with_options(http_client=DefaultHttpxClient(...))\n```\n\n### Managing HTTP resources\n\nBy default the library closes underlying HTTP connections whenever the client is [garbage collected](https://docs.python.org/3/reference/datamodel.html#object.__del__). You can manually close the client using the `.close()` method if desired, or with a context manager that closes when exiting.\n\n```py\nfrom linq import LinqAPIV3\n\nwith LinqAPIV3() as client:\n  # make requests here\n  ...\n\n# HTTP client is now closed\n```\n\n## Versioning\n\nThis package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:\n\n1. Changes that only affect static types, without breaking runtime behavior.\n2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_\n3. Changes that we do not expect to impact the vast majority of users in practice.\n\nWe take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.\n\nWe are keen for your feedback; please open an [issue](https://www.github.com/linq-team/linq-python/issues) with questions, bugs, or suggestions.\n\n### Determining the installed version\n\nIf you\'ve upgraded to the latest version but aren\'t seeing any new features you were expecting then your python environment is likely still using an older version.\n\nYou can determine the version that is being used at runtime with:\n\n```py\nimport linq\nprint(linq.__version__)\n```\n\n## Requirements\n\nPython 3.9 or higher.\n\n## Contributing\n\nSee [the contributing documentation](./CONTRIBUTING.md).\n',
  },
  {
    language: 'typescript',
    content:
      "# Linq API V3 TypeScript API Library\n\n[![NPM version](https://img.shields.io/npm/v/@linqapp/sdk.svg?label=npm%20(stable))](https://npmjs.org/package/@linqapp/sdk) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@linqapp/sdk)\n\nThis library provides convenient access to the Linq API V3 REST API from server-side TypeScript or JavaScript.\n\n\n\nThe REST API documentation can be found on [docs.linqapp.com](https://docs.linqapp.com). The full API of this library can be found in [api.md](api.md).\n\nIt is generated with [Stainless](https://www.stainless.com/).\n\n## MCP Server\n\nUse the Linq API V3 MCP Server to enable AI assistants to interact with this API, allowing them to explore endpoints, make test requests, and use documentation to help integrate this SDK into your application.\n\n[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=%40linqapp%2Fsdk-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBsaW5xYXBwL3Nkay1tY3AiXSwiZW52Ijp7IkxJTlFfQVBJX1YzX0FQSV9LRVkiOiJNeSBBUEkgS2V5IiwiTElOUV9XRUJIT09LX1NFQ1JFVCI6Ik15IFdlYmhvb2sgU2VjcmV0In19)\n[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22%40linqapp%2Fsdk-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40linqapp%2Fsdk-mcp%22%5D%2C%22env%22%3A%7B%22LINQ_API_V3_API_KEY%22%3A%22My%20API%20Key%22%2C%22LINQ_WEBHOOK_SECRET%22%3A%22My%20Webhook%20Secret%22%7D%7D)\n\n> Note: You may need to set environment variables in your MCP client.\n\n## Installation\n\n```sh\nnpm install @linqapp/sdk\n```\n\n\n\n## Usage\n\nThe full API of this library can be found in [api.md](api.md).\n\n<!-- prettier-ignore -->\n```js\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst chat = await client.chats.create({\n  from: '+12052535597',\n  message: {},\n  to: ['+12052532136'],\n});\n\nconsole.log(chat.chat);\n```\n\n\n\n### Request & Response types\n\nThis library includes TypeScript definitions for all request params and response fields. You may import and use them like so:\n\n<!-- prettier-ignore -->\n```ts\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted\n});\n\nconst params: LinqAPIV3.ChatCreateParams = {\n  from: '+12052535597',\n  message: {},\n  to: ['+12052532136'],\n};\nconst chat: LinqAPIV3.ChatCreateResponse = await client.chats.create(params);\n```\n\nDocumentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.\n\n\n\n\n\n## Handling errors\n\nWhen the library is unable to connect to the API,\nor if the API returns a non-success status code (i.e., 4xx or 5xx response),\na subclass of `APIError` will be thrown:\n\n<!-- prettier-ignore -->\n```ts\nconst chat = await client.chats\n  .create({\n    from: '+12052535597',\n    message: {},\n    to: ['+12052532136'],\n  })\n  .catch(async (err) => {\n    if (err instanceof LinqAPIV3.APIError) {\n      console.log(err.status); // 400\n      console.log(err.name); // BadRequestError\n      console.log(err.headers); // {server: 'nginx', ...}\n    } else {\n      throw err;\n    }\n  });\n```\n\nError codes are as follows:\n\n| Status Code | Error Type                 |\n| ----------- | -------------------------- |\n| 400         | `BadRequestError`          |\n| 401         | `AuthenticationError`      |\n| 403         | `PermissionDeniedError`    |\n| 404         | `NotFoundError`            |\n| 422         | `UnprocessableEntityError` |\n| 429         | `RateLimitError`           |\n| >=500       | `InternalServerError`      |\n| N/A         | `APIConnectionError`       |\n\n### Retries\n\nCertain errors will be automatically retried 2 times by default, with a short exponential backoff.\nConnection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,\n429 Rate Limit, and >=500 Internal errors will all be retried by default.\n\nYou can use the `maxRetries` option to configure or disable this:\n\n<!-- prettier-ignore -->\n```js\n// Configure the default for all requests:\nconst client = new LinqAPIV3({\n  maxRetries: 0, // default is 2\n});\n\n// Or, configure per-request:\nawait client.chats.create({\n  from: '+12052535597',\n  message: {},\n  to: ['+12052532136'],\n}, {\n  maxRetries: 5,\n});\n```\n\n### Timeouts\n\nRequests time out after 1 minute by default. You can configure this with a `timeout` option:\n\n<!-- prettier-ignore -->\n```ts\n// Configure the default for all requests:\nconst client = new LinqAPIV3({\n  timeout: 20 * 1000, // 20 seconds (default is 1 minute)\n});\n\n// Override per-request:\nawait client.chats.create({\n  from: '+12052535597',\n  message: {},\n  to: ['+12052532136'],\n}, {\n  timeout: 5 * 1000,\n});\n```\n\nOn timeout, an `APIConnectionTimeoutError` is thrown.\n\nNote that requests which time out will be [retried twice by default](#retries).\n\n## Auto-pagination\n\nList methods in the LinqAPIV3 API are paginated.\nYou can use the `for await … of` syntax to iterate through items across all pages:\n\n```ts\nasync function fetchAllChats(params) {\n  const allChats = [];\n  // Automatically fetches more pages as needed.\n  for await (const chat of client.chats.listChats()) {\n    allChats.push(chat);\n  }\n  return allChats;\n}\n```\n\nAlternatively, you can request a single page at a time:\n\n```ts\nlet page = await client.chats.listChats();\nfor (const chat of page.chats) {\n  console.log(chat);\n}\n\n// Convenience methods are provided for manually paginating:\nwhile (page.hasNextPage()) {\n  page = await page.getNextPage();\n  // ...\n}\n```\n\n\n\n## Advanced Usage\n\n### Accessing raw Response data (e.g., headers)\n\nThe \"raw\" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.\nThis method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.\n\nYou can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.\nUnlike `.asResponse()` this method consumes the body, returning once it is parsed.\n\n<!-- prettier-ignore -->\n```ts\nconst client = new LinqAPIV3();\n\nconst response = await client.chats\n  .create({\n    from: '+12052535597',\n    message: {},\n    to: ['+12052532136'],\n  })\n  .asResponse();\nconsole.log(response.headers.get('X-My-Header'));\nconsole.log(response.statusText); // access the underlying Response object\n\nconst { data: chat, response: raw } = await client.chats\n  .create({\n    from: '+12052535597',\n    message: {},\n    to: ['+12052532136'],\n  })\n  .withResponse();\nconsole.log(raw.headers.get('X-My-Header'));\nconsole.log(chat.chat);\n```\n\n### Logging\n\n> [!IMPORTANT]\n> All log messages are intended for debugging only. The format and content of log messages\n> may change between releases.\n\n#### Log levels\n\nThe log level can be configured in two ways:\n\n1. Via the `LINQ_API_V3_LOG` environment variable\n2. Using the `logLevel` client option (overrides the environment variable if set)\n\n```ts\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  logLevel: 'debug', // Show all log messages\n});\n```\n\nAvailable log levels, from most to least verbose:\n\n- `'debug'` - Show debug messages, info, warnings, and errors\n- `'info'` - Show info messages, warnings, and errors\n- `'warn'` - Show warnings and errors (default)\n- `'error'` - Show only errors\n- `'off'` - Disable all logging\n\nAt the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.\nSome authentication-related headers are redacted, but sensitive data in request and response bodies\nmay still be visible.\n\n#### Custom logger\n\nBy default, this library logs to `globalThis.console`. You can also provide a custom logger.\nMost logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.\n\nWhen providing a custom logger, the `logLevel` option still controls which messages are emitted, messages\nbelow the configured level will not be sent to your logger.\n\n```ts\nimport LinqAPIV3 from '@linqapp/sdk';\nimport pino from 'pino';\n\nconst logger = pino();\n\nconst client = new LinqAPIV3({\n  logger: logger.child({ name: 'LinqAPIV3' }),\n  logLevel: 'debug', // Send all messages to pino, allowing it to filter\n});\n```\n\n### Making custom/undocumented requests\n\nThis library is typed for convenient access to the documented API. If you need to access undocumented\nendpoints, params, or response properties, the library can still be used.\n\n#### Undocumented endpoints\n\nTo make requests to undocumented endpoints, you can use `client.get`, `client.post`, and other HTTP verbs.\nOptions on the client, such as retries, will be respected when making these requests.\n\n```ts\nawait client.post('/some/path', {\n  body: { some_prop: 'foo' },\n  query: { some_query_arg: 'bar' },\n});\n```\n\n#### Undocumented request params\n\nTo make requests using undocumented parameters, you may use `// @ts-expect-error` on the undocumented\nparameter. This library doesn't validate at runtime that the request matches the type, so any extra values you\nsend will be sent as-is.\n\n```ts\nclient.chats.create({\n  // ...\n  // @ts-expect-error baz is not yet public\n  baz: 'undocumented option',\n});\n```\n\nFor requests with the `GET` verb, any extra params will be in the query, all other requests will send the\nextra param in the body.\n\nIf you want to explicitly send an extra argument, you can do so with the `query`, `body`, and `headers` request\noptions.\n\n#### Undocumented response properties\n\nTo access undocumented response properties, you may access the response object with `// @ts-expect-error` on\nthe response object, or cast the response object to the requisite type. Like the request params, we do not\nvalidate or strip extra properties from the response from the API.\n\n### Customizing the fetch client\n\nBy default, this library expects a global `fetch` function is defined.\n\nIf you want to use a different `fetch` function, you can either polyfill the global:\n\n```ts\nimport fetch from 'my-fetch';\n\nglobalThis.fetch = fetch;\n```\n\nOr pass it to the client:\n\n```ts\nimport LinqAPIV3 from '@linqapp/sdk';\nimport fetch from 'my-fetch';\n\nconst client = new LinqAPIV3({ fetch });\n```\n\n### Fetch options\n\nIf you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)\n\n```ts\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  fetchOptions: {\n    // `RequestInit` options\n  },\n});\n```\n\n#### Configuring proxies\n\nTo modify proxy behavior, you can provide custom `fetchOptions` that add runtime-specific proxy\noptions to requests:\n\n<img src=\"https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/node.svg\" align=\"top\" width=\"18\" height=\"21\"> **Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>\n\n```ts\nimport LinqAPIV3 from '@linqapp/sdk';\nimport * as undici from 'undici';\n\nconst proxyAgent = new undici.ProxyAgent('http://localhost:8888');\nconst client = new LinqAPIV3({\n  fetchOptions: {\n    dispatcher: proxyAgent,\n  },\n});\n```\n\n<img src=\"https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/bun.svg\" align=\"top\" width=\"18\" height=\"21\"> **Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>\n\n```ts\nimport LinqAPIV3 from '@linqapp/sdk';\n\nconst client = new LinqAPIV3({\n  fetchOptions: {\n    proxy: 'http://localhost:8888',\n  },\n});\n```\n\n<img src=\"https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/deno.svg\" align=\"top\" width=\"18\" height=\"21\"> **Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>\n\n```ts\nimport LinqAPIV3 from 'npm:@linqapp/sdk';\n\nconst httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });\nconst client = new LinqAPIV3({\n  fetchOptions: {\n    client: httpClient,\n  },\n});\n```\n\n## Frequently Asked Questions\n\n## Semantic versioning\n\nThis package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:\n\n1. Changes that only affect static types, without breaking runtime behavior.\n2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_\n3. Changes that we do not expect to impact the vast majority of users in practice.\n\nWe take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.\n\nWe are keen for your feedback; please open an [issue](https://www.github.com/linq-team/linq-node/issues) with questions, bugs, or suggestions.\n\n## Requirements\n\nTypeScript >= 4.9 is supported.\n\nThe following runtimes are supported:\n\n- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)\n- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.\n- Deno v1.28.0 or higher.\n- Bun 1.0 or later.\n- Cloudflare Workers.\n- Vercel Edge Runtime.\n- Jest 28 or greater with the `\"node\"` environment (`\"jsdom\"` is not supported at this time).\n- Nitro v2.6 or greater.\n\nNote that React Native is not supported at this time.\n\nIf you are interested in other runtime environments, please open or upvote an issue on GitHub.\n\n## Contributing\n\nSee [the contributing documentation](./CONTRIBUTING.md).\n",
  },
];

const INDEX_OPTIONS = {
  fields: [
    'name',
    'endpoint',
    'summary',
    'description',
    'qualified',
    'stainlessPath',
    'content',
    'sectionContext',
  ],
  storeFields: ['kind', '_original'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.1,
    boost: {
      name: 5,
      stainlessPath: 3,
      endpoint: 3,
      qualified: 3,
      summary: 2,
      content: 1,
      description: 1,
    } as Record<string, number>,
  },
};

/**
 * Self-contained local search engine backed by MiniSearch.
 * Method data is embedded at SDK build time; prose documents
 * can be loaded from an optional docs directory at runtime.
 */
export class LocalDocsSearch {
  private methodIndex: MiniSearch<MiniSearchDocument>;
  private proseIndex: MiniSearch<MiniSearchDocument>;

  private constructor() {
    this.methodIndex = new MiniSearch<MiniSearchDocument>(INDEX_OPTIONS);
    this.proseIndex = new MiniSearch<MiniSearchDocument>(INDEX_OPTIONS);
  }

  static async create(opts?: { docsDir?: string }): Promise<LocalDocsSearch> {
    const instance = new LocalDocsSearch();
    instance.indexMethods(EMBEDDED_METHODS);
    for (const readme of EMBEDDED_READMES) {
      instance.indexProse(readme.content, `readme:${readme.language}`);
    }
    if (opts?.docsDir) {
      await instance.loadDocsDirectory(opts.docsDir);
    }
    return instance;
  }

  search(props: {
    query: string;
    language?: string;
    detail?: string;
    maxResults?: number;
    maxLength?: number;
  }): SearchResult {
    const { query, language = 'typescript', detail = 'default', maxResults = 5, maxLength = 100_000 } = props;

    const useMarkdown = detail === 'verbose' || detail === 'high';

    // Search both indices and merge results by score.
    // Filter prose hits so language-tagged content (READMEs and docs with
    // frontmatter) only matches the requested language.
    const methodHits = this.methodIndex
      .search(query)
      .map((hit) => ({ ...hit, _kind: 'http_method' as const }));
    const proseHits = this.proseIndex
      .search(query)
      .filter((hit) => {
        const source = ((hit as Record<string, unknown>)['_original'] as ProseChunk | undefined)?.source;
        if (!source) return true;
        // Check for language-tagged sources: "readme:<lang>" or "lang:<lang>:<filename>"
        let taggedLang: string | undefined;
        if (source.startsWith('readme:')) taggedLang = source.slice('readme:'.length);
        else if (source.startsWith('lang:')) taggedLang = source.split(':')[1];
        if (!taggedLang) return true;
        return taggedLang === language || (language === 'javascript' && taggedLang === 'typescript');
      })
      .map((hit) => ({ ...hit, _kind: 'prose' as const }));
    const merged = [...methodHits, ...proseHits].sort((a, b) => b.score - a.score);
    const top = merged.slice(0, maxResults);

    const fullResults: (string | Record<string, unknown>)[] = [];

    for (const hit of top) {
      const original = (hit as Record<string, unknown>)['_original'];
      if (hit._kind === 'http_method') {
        const m = original as MethodEntry;
        if (useMarkdown && m.markdown) {
          fullResults.push(m.markdown);
        } else {
          // Use per-language data when available, falling back to the
          // top-level fields (which are TypeScript-specific in the
          // legacy codepath).
          const langData = m.perLanguage?.[language];
          fullResults.push({
            method: langData?.method ?? m.qualified,
            summary: m.summary,
            description: m.description,
            endpoint: `${m.httpMethod.toUpperCase()} ${m.endpoint}`,
            ...(langData?.example ? { example: langData.example } : {}),
            ...(m.params ? { params: m.params } : {}),
            ...(m.response ? { response: m.response } : {}),
          });
        }
      } else {
        const c = original as ProseChunk;
        fullResults.push({
          content: c.content,
          ...(c.source ? { source: c.source } : {}),
        });
      }
    }

    let totalLength = 0;
    const results: (string | Record<string, unknown>)[] = [];
    for (const result of fullResults) {
      const len = typeof result === 'string' ? result.length : JSON.stringify(result).length;
      totalLength += len;
      if (totalLength > maxLength) break;
      results.push(result);
    }

    if (results.length < fullResults.length) {
      results.unshift(`Truncated; showing ${results.length} of ${fullResults.length} results.`);
    }

    return { results };
  }

  private indexMethods(methods: MethodEntry[]): void {
    const docs: MiniSearchDocument[] = methods.map((m, i) => ({
      id: `method-${i}`,
      kind: 'http_method' as const,
      name: m.name,
      endpoint: m.endpoint,
      summary: m.summary,
      description: m.description,
      qualified: m.qualified,
      stainlessPath: m.stainlessPath,
      _original: m as unknown as Record<string, unknown>,
    }));
    if (docs.length > 0) {
      this.methodIndex.addAll(docs);
    }
  }

  private async loadDocsDirectory(docsDir: string): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(docsDir, { withFileTypes: true });
    } catch (err) {
      getLogger().warn({ err, docsDir }, 'Could not read docs directory');
      return;
    }

    const files = entries
      .filter((e) => e.isFile())
      .filter((e) => e.name.endsWith('.md') || e.name.endsWith('.markdown') || e.name.endsWith('.json'));

    for (const file of files) {
      try {
        const filePath = path.join(docsDir, file.name);
        const content = await fs.readFile(filePath, 'utf-8');

        if (file.name.endsWith('.json')) {
          const texts = extractTexts(JSON.parse(content));
          if (texts.length > 0) {
            this.indexProse(texts.join('\n\n'), file.name);
          }
        } else {
          // Parse optional YAML frontmatter for language tagging.
          // Files with a "language" field in frontmatter will only
          // surface in searches for that language.
          //
          // Example:
          //   ---
          //   language: python
          //   ---
          //   # Error handling in Python
          //   ...
          const frontmatter = parseFrontmatter(content);
          const source = frontmatter.language ? `lang:${frontmatter.language}:${file.name}` : file.name;
          this.indexProse(content, source);
        }
      } catch (err) {
        getLogger().warn({ err, file: file.name }, 'Failed to index docs file');
      }
    }
  }

  private indexProse(markdown: string, source: string): void {
    const chunks = chunkMarkdown(markdown);
    const baseId = this.proseIndex.documentCount;

    const docs: MiniSearchDocument[] = chunks.map((chunk, i) => ({
      id: `prose-${baseId + i}`,
      kind: 'prose' as const,
      content: chunk.content,
      ...(chunk.sectionContext != null ? { sectionContext: chunk.sectionContext } : {}),
      _original: { ...chunk, source } as unknown as Record<string, unknown>,
    }));

    if (docs.length > 0) {
      this.proseIndex.addAll(docs);
    }
  }
}

/** Lightweight markdown chunker — splits on headers, chunks by word count. */
function chunkMarkdown(markdown: string): { content: string; tag: string; sectionContext?: string }[] {
  // Strip YAML frontmatter
  const stripped = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const lines = stripped.split('\n');

  const chunks: { content: string; tag: string; sectionContext?: string }[] = [];
  const headers: string[] = [];
  let current: string[] = [];

  const flush = () => {
    const text = current.join('\n').trim();
    if (!text) return;
    const sectionContext = headers.length > 0 ? headers.join(' > ') : undefined;
    // Split into ~200-word chunks
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length; i += 200) {
      const slice = words.slice(i, i + 200).join(' ');
      if (slice) {
        chunks.push({ content: slice, tag: 'p', ...(sectionContext != null ? { sectionContext } : {}) });
      }
    }
    current = [];
  };

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headerMatch) {
      flush();
      const level = headerMatch[1]!.length;
      const text = headerMatch[2]!.trim();
      while (headers.length >= level) headers.pop();
      headers.push(text);
    } else {
      current.push(line);
    }
  }
  flush();

  return chunks;
}

/** Recursively extracts string values from a JSON structure. */
function extractTexts(data: unknown, depth = 0): string[] {
  if (depth > 10) return [];
  if (typeof data === 'string') return data.trim() ? [data] : [];
  if (Array.isArray(data)) return data.flatMap((item) => extractTexts(item, depth + 1));
  if (typeof data === 'object' && data !== null) {
    return Object.values(data).flatMap((v) => extractTexts(v, depth + 1));
  }
  return [];
}

/** Parses YAML frontmatter from a markdown string, extracting the language field if present. */
function parseFrontmatter(markdown: string): { language?: string } {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const body = match[1] ?? '';
  const langMatch = body.match(/^language:\s*(.+)$/m);
  return langMatch ? { language: langMatch[1]!.trim() } : {};
}

export const webhookEvents = [
  'message.sent',
  'message.deleted',
  'user.created',
  'user.suspended',
  'group.created',
  'file.uploaded',
];

export const webhooks = [
  {
    id: 'w1',
    name: 'CRM sync',
    url: 'https://hooks.example-crm.com/nimbus/incoming',
    events: ['user.created', 'user.suspended'],
    status: 'active',
    lastTriggered: '12 min ago',
    secret: 'whsec_5f2c...a91b',
  },
  {
    id: 'w2',
    name: 'Analytics pipeline',
    url: 'https://ingest.example-analytics.io/v1/events',
    events: ['message.sent', 'file.uploaded', 'group.created'],
    status: 'active',
    lastTriggered: '2 min ago',
    secret: 'whsec_9b13...c204',
  },
  {
    id: 'w3',
    name: 'Legacy audit log (deprecated)',
    url: 'https://old-audit.internal.example.com/hook',
    events: ['message.deleted'],
    status: 'disabled',
    lastTriggered: '18 days ago',
    secret: 'whsec_1a77...ef03',
  },
];

export default [
  {
    type: 'free',
    price: 0,
    eventsCount: 5,
    reportStorageTtl: 259_200_000,
    chatInclude: false,
  },
  {
    type: 'basic',
    price: 5,
    eventsCount: 50,
    reportStorageTtl: 864_000_000,
    chatInclude: true,
  },
  {
    type: 'team',
    price: 10,
    eventsCount: 1000,
    reportStorageTtl: 864_000_000,
    chatInclude: true,
  },
];

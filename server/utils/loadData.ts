const data = [{
  hostname: 'mywebsite',
  pathname: null,
  title: 'My website at mywebsite'
}, {
  hostname: 'mywebsite',
  pathname: 'meinangebot',
  title: 'My website at mywebsite about'
}];

export async function loadData(hostname: string, pathname: string | null = null) {
  // TODO: remove wait for 1 sec for testing purposes
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!!pathname) {
    pathname = pathname.replace(/^\/+|\/+$/g, '');

    if (pathname === '') {
      pathname = null;
    }
  }

  const dataItem = data.find(item => item.hostname === hostname && item.pathname === pathname);

  return dataItem || null;
}
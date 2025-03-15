import { getDatabaseConnection } from './db';

export async function loadWebsite(hostname: string, pathname: string | null = null) {
  const db = await getDatabaseConnection()

  if (!!pathname) {
    pathname = pathname.replace(/^\/+|\/+$/g, '');

    if (pathname === '') {
      pathname = '/';
    }
  }

  const website = await db.selectFrom('websites')
    .selectAll()
    .where('domain', '=', hostname)
    .where('path', '=', pathname)
    .where('isOnline', '=', true)
    .limit(1)
    .executeTakeFirst();

  return website;
}
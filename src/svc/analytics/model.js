import {writeQuery} from '../utils/db';

export async function writeNewActivity(ip, memberId, path, action) {
    await writeQuery('INSERT activity_log (ip, member_id, path, action) VALUES (?)', [[ip, memberId, path, action]]);
}

export async function writeNewErrorActivity(ip, memberId, path, action, error, userAgent) {
    await writeQuery('INSERT error_log (ip, member_id, path, action, error, userAgent) VALUES (?)',[[ip, memberId, path, action,error, userAgent]]);
}
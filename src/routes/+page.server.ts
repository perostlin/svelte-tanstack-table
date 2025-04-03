import type { PageServerLoad } from './$types';
import { users } from './(data)/users';

export const load = (async ({ url }) => {
    const pageIndex = Number(url.searchParams.get('page') ?? 0);
    const pageSize = Number(url.searchParams.get('size') ?? 2);
    const filterParam = url.searchParams.get('filter') ?? ''; // format: "name:alice"
    const [filterColumn, filterValue] = filterParam.split(':');

    let filteredUsers = users;
    if (filterParam) {
        filteredUsers = users.filter((user) => user[filterColumn as keyof typeof user].toLowerCase().includes(filterValue.toLowerCase()));
    }

    return {
        users: filteredUsers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
        rowCount: filteredUsers.length,
        columnFilters: filterColumn && filterValue
            ? [{ id: filterColumn, value: filterValue }]
            : [],
        pagination: {
            pageIndex,
            pageSize
        }
    };
}) satisfies PageServerLoad;
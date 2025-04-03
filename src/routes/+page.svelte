<script lang="ts">
	import type { PageData } from './$types';
	import Table from './(components)/table.svelte';

	let { data }: { data: PageData } = $props();

	const columns = [
		{
			header: 'Name',
			accessorKey: 'name'
		}
	];
</script>

<div>
	<Table
		{columns}
		data={data.users}
		filter={{ column: 'name' }}
		columnFilters={data.columnFilters}
		pagination={data.pagination}
		rowCount={data.rowCount}
	/>
</div>

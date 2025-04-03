<script lang="ts" generics="TData, TValue">
	import { createTable } from '@tanstack/svelte-table';
	import {
		type ColumnDef,
		type ColumnFiltersState,
		getCoreRowModel,
		type PaginationState
	} from '@tanstack/table-core';

	import { goto } from '$app/navigation';

	let {
		columns,
		data,
		filter,
		columnFilters,
		pagination,
		rowCount
	}: {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		filter: { column: string };
		columnFilters: ColumnFiltersState;
		pagination: PaginationState;
		rowCount: number;
	} = $props();

	const updateURL = (params: Record<string, string | number>) => {
		const url = new URL(window.location.href);
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.set(key, value.toString());
		}
		goto(url.pathname + '?' + url.searchParams.toString(), {
			replaceState: false,
			noScroll: true
		});
	};

	const table = createTable({
		get data() {
			return data;
		},
		state: {
			get columnFilters() {
				return columnFilters;
			},
			get pagination() {
				return pagination;
			}
		},
		columns,
		manualFiltering: true,
		manualPagination: true,
		rowCount: rowCount,
		onColumnFiltersChange: (updater) => {
			const next = typeof updater === 'function' ? updater(columnFilters) : updater;
			const activeFilter = next.find((f) => f.id === filter.column && f.value);

			if (activeFilter) {
				updateURL({ filter: `${activeFilter.id}:${activeFilter.value}` });
			} else {
				updateURL({ filter: '' });
			}
		},
		onPaginationChange: (updater) => {
			const next = typeof updater === 'function' ? updater(pagination) : updater;
			updateURL({ page: next.pageIndex, size: next.pageSize });
		},
		getCoreRowModel: getCoreRowModel()
	});
</script>

<div>Table</div>

<input
	placeholder="Filter..."
	value={(table.getColumn(filter.column)?.getFilterValue() as string) ?? ''}
	onkeypress={(e) => {
		if (e.key === 'Enter') {
			table.getColumn(filter.column)?.setFilterValue(e.currentTarget.value);
		}
	}}
	onblur={(e) => {
		table.getColumn(filter.column)?.setFilterValue(e.currentTarget.value);
	}}
	class="h-8 w-[150px] lg:w-[250px]"
/>

<table>
	<thead>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<tr>
				{#each headerGroup.headers as header (header.id)}
					<th colspan={header.colSpan}>
						{header.column.columnDef.header}
					</th>
				{/each}
			</tr>
		{/each}
	</thead>
	<tbody>
		{#each table.getRowModel().rows as row (row.id)}
			<tr>
				{#each row.getVisibleCells() as cell (cell.id)}
					<td>
						{cell.getValue()}
					</td>
				{/each}
			</tr>
		{:else}
			<tr>
				<td colspan={columns.length} class="h-24 text-center">No results.</td>
			</tr>
		{/each}
	</tbody>
</table>

Current Page Count: {table.getPageCount()}

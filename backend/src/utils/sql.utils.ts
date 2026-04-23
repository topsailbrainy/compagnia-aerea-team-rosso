type UpdateQueryOptions = {
    table: string;
    idColumn: string;
    idValue: number | string;
    data: Record<string, unknown>;
    returning: string;
};

export function buildUpdateQuery({
    table,
    idColumn,
    idValue,
    data,
    returning,
}: UpdateQueryOptions) {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined);

    if (entries.length === 0) {
        throw new Error("No fields provided for update");
    }

    const assignments = entries
        .map(([key], index) => `${key} = $${index + 1}`)
        .join(", ");

    return {
        text: `UPDATE ${table} SET ${assignments} WHERE ${idColumn} = $${entries.length + 1} RETURNING ${returning}`,
        values: [...entries.map(([, value]) => value), idValue],
    };
}

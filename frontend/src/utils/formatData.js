export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('th-Th', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
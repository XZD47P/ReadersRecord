export async function load({params, fetch}) {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${params.id}`);
    const book = await res.json();

    return {
        book
    };
}
export function searchRegistry( query: string ) {
    const url = `http://localhost:4873/-/verdaccio/data/search/${encodeURIComponent( query )}`;

    return fetch( url );
}

export function getReadme( pkg: string ) {
    const url = `http://localhost:4873/-/verdaccio/data/package/readme/${pkg}`;

    return fetch( url );
}

export function getPackage( pkg: string ) {
    const url = `http://localhost:4873/-/verdaccio/data/sidebar/${pkg}`;

    return fetch( url );
}
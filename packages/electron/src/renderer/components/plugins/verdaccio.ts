const REGISTRY = 'https://rrox-registry.tom90.nl';

export function searchRegistry( query: string ) {
    const url = `${REGISTRY}/-/verdaccio/data/search/${encodeURIComponent( query )}`;

    return fetch( url );
}

export function getReadme( pkg: string ) {
    const url = `${REGISTRY}/-/verdaccio/data/package/readme/${pkg}`;

    return fetch( url );
}

export function getPackage( pkg: string ) {
    const url = `${REGISTRY}/-/verdaccio/data/sidebar/${pkg}`;

    return fetch( url );
}
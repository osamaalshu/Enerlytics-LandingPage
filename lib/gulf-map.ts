/**
 * Gulf map geometry for SiteMap — generated from johan/world.geo.json
 * (low-resolution country outlines, public domain), equirectangular
 * projection: x = (lon − 51°)·cos 21.5°·58, y = (27° − lat)·58. viewBox 0 0 490 640.
 */
export const MAP_W = 490;
export const MAP_H = 640;
export const OMAN_PATH = 'M 424.2 341.4 L 404.1 381.1 L 379.6 378.1 L 368.4 391.9 L 359.7 421.3 L 366.3 460.1 L 361.3 467.2 L 336.4 467.0 L 302.7 488.7 L 297.5 516.9 L 285.1 529.2 L 251.6 528.7 L 230.4 543.3 L 230.7 566.8 L 204.6 582.9 L 174.8 577.4 L 138.7 597.0 L 113.8 600.2 L 96.2 559.7 L 54.0 464.0 L 215.9 406.0 L 251.8 290.0 L 227.1 248.9 L 228.5 225.6 L 244.2 201.6 L 244.4 177.9 L 268.8 166.4 L 259.3 158.4 L 263.7 120.6 L 291.2 120.4 L 315.4 160.0 L 345.6 181.0 L 385.1 188.6 L 417.1 199.2 L 441.5 232.4 L 456.0 251.7 L 475.3 259.1 L 475.2 272.0 L 455.6 306.6 L 447.0 322.8 L 424.2 341.4 Z M 290.9 64.0 L 283.9 74.6 L 273.6 54.8 L 289.4 35.0 L 296.0 40.1 L 290.9 64.0 Z';
export const UAE_PATH = 'M 31.3 159.8 L 40.9 156.9 L 42.9 172.9 L 85.1 163.7 L 129.7 165.2 L 162.3 166.9 L 199.3 127.7 L 239.5 90.5 L 273.6 54.8 L 283.9 74.6 L 291.2 120.4 L 263.7 120.6 L 259.3 158.4 L 268.8 166.4 L 244.4 177.9 L 244.2 201.6 L 228.5 225.6 L 227.1 248.9 L 216.2 261.2 L 54.0 231.9 L 33.3 173.2 L 31.3 159.8 Z';
export const proj = (lon: number, lat: number): [number, number] => [
  Math.round((lon - 51) * 0.9304 * 58 * 10) / 10,
  Math.round((27 - lat) * 58 * 10) / 10,
];
export const CITIES = [{"name": "Sohar", "lon": 56.71, "lat": 24.35}, {"name": "Muscat", "lon": 58.41, "lat": 23.59}, {"name": "Nizwa", "lon": 57.53, "lat": 22.93}, {"name": "Sur", "lon": 59.53, "lat": 22.57}, {"name": "Duqm", "lon": 57.7, "lat": 19.65}, {"name": "Salalah", "lon": 54.09, "lat": 17.02}, {"name": "Ibri", "lon": 56.52, "lat": 23.23}] as const;

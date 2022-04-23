import { renderToString, renderToStaticMarkup } from 'react-dom/server';

import MainApp from '../client/main/App.js';
import MainTemplate from '../templates/MainTemplate.js';
import getScripts from '../utils/getScripts.js';
import { createElement, createHTML } from '../utils/markup.js';

const doctype = '<!DOCTYPE html>';

export default function serveMainPage(req, res) {
  const content = createHTML(renderToString(createElement(MainApp)));

  const html =
    doctype +
    renderToStaticMarkup(createElement(MainTemplate, { content }));

  res
    .set({
      'Cache-Control': 'public, max-age=14400', // 4 hours
      'Cache-Tag': 'main'
    })
    .send(html);
}

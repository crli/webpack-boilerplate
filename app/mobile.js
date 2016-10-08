import './main1.scss';
import $ from 'jquery';
import 'imports?jQuery=jquery!./plugin/jqPlugin.js';

$(document).ready(function() {
  let app  = document.createElement('div');
  app.innerHTML = '<h1>Hello World</h1>';
  document.body.appendChild(app);
  $('h1').greenify();
});

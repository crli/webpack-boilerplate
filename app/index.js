import './main.css';
import './main1.scss';
import generateText from './sub';
import $ from 'jquery';
import 'imports?jQuery=jquery!./plugin/jqPlugin.js';

let app  = document.createElement('div');
const myPromise = Promise.resolve(12);
myPromise.then((number) => {
  $('body').append('<p>s111111111' + number  + '</p>');
    //call our jquery plugin!
  $('p').greenify();
});
app.innerHTML = '<h1>Hello World it</h1>';
document.body.appendChild(app);
app.appendChild(generateText());
$('body').css('backgroundColor','#e1e1e1')

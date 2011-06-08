Wordy
=====

Wordy is a JavaScript library which converts numbers into their corresponding
English numerals and vice versa. It's a simple tool which has many practical
and non-practical applications. One of the ways I see it being used to to
translate text from an OCR operation into a number that can be searched. 
Also I figured it could be cool to replace url id's with just for the sake of
security since robots can't read English that well (unless they too use Wordy).

Example Usage
=============

ciphering (numbers to numerals)
---------------------------------
  var wordy = require('wordy');
  wordy.cipher(1463); //#=> 'OneThousandFourHundredSixtyThree'

deciphering (numerals to words)
-------------------------------
  var wordy = require('wordy');
  wordy.decipher('OneThousandFourHundredSixtyThree') //#=> 1463

Installation
============

  npm install wordy
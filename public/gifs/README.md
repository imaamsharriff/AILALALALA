# Drop your GIFs here 🎀

Any `.gif` (or `.png`, `.webp`) you put in this folder is served at
`/gifs/<filename>`.

To actually use one, open `src/lib/assets.js` and add it to a slot:

```js
partyCat: {
  sources: [local('party-cat.gif')],
  alt: 'A very excited party cat',
},
```

Suggested filenames, one per slot:

| slot             | suggested file           | where it shows up                |
| ---------------- | ------------------------ | -------------------------------- |
| `partyCat`       | `party-cat.gif`          | birthday intro                   |
| `cryingCat`      | `crying-cat.gif`         | after picking the moon           |
| `celebrationCat` | `celebration-cat.gif`    | the "IT'S AILA" reveal + finale  |
| `sadCat`         | `sad-cat.gif`            | the 10,000/10 punchline          |
| `birthdayCat`    | `birthday-cat.gif`       | the final conclusion card        |

If a slot has no sources — or the file is missing, blocked, or slow — the site
falls back to its hand-drawn animated sticker. Nothing ever breaks.

Keep files small (under ~1 MB each) so the page stays snappy on phones.

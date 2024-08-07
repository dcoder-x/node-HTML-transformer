# Node HTML transformers

The `Node HTML transformers` class is designed to facilitate the conversion of HTML content to other formats, specifically to PDF and image. It provides methods to replace placeholders in the HTML content and then convert the processed HTML to a PDF file or an image.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Class Methods](#class-methods)
  - [toString](#tostring)
  - [toPDF](#topdf)
  - [toImage](#toimage)
- [Class Properties](#class-properties)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

Make sure you have Node.js and npm installed. Install the required dependencies using the following command:

```bash
npm install node-html-transformers
```

## Usage

```typescript
import HtmlTransformer from 'node-html-transformers';

// Create an instance of the HTMLTransformer class
const converter = new HtmlTransformer('path/to/html/file.html', 'utf-8', { variable1: 'value1', variable2: 'value2' });

// Convert HTML to PDF
const pdfContent = await converter.toPDF('output.pdf');
console.log('Base64-encoded PDF Content:', pdfContent);

// Convert HTML to Image
const imageContent = await converter.toImage('output.png');
console.log('Base64-encoded Image Content:', imageContent);

```

## Templating with HTML

You can create placeholders in HTML documents and then Dynamically pass in data.
To do this you should surround the placeholder variable with double curly braces e.g `{{placeholderVariable}}`. 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Document</title>
</head>
<body>
    <h1>
        Sample template in html
    </h1>
    <p>
        My name is {{name}}, I am {{age}} years old.
    </p>
<img src={{imageUrl}} />
</body>
</html>
```



Then, pass the same variable name as a field to the content `{placeholderVariable:value}` argument when creating an instance of the HtmlTransformer class e.g 

```typescript
import HtmlTransformer from 'node-html-transformers';

// Create an instance of the HTMLTransformer class
const converter = new HtmlTransformer('path/to/html/file.html', 'utf-8', { name: 'Ayomikun', age: '20' });


```



## Class Methods


### toString

Converts the HTML content to a string with replaced placeholders.
returns a string

```typescript
  const htmlString = await converter.toString();

```

### toPDF
Converts the HTML content to a PDF file.
-- returns a base64 encoded PDF string

```typescript
const pdfContent = await converter.toPDF('output.pdf');
console.log('Base64-encoded PDF Content:', pdfContent);

```

### toImage


Converts the HTML content to an image.
-- returns a base64 encoded Image string

```typescript
const imageContent = await converter.toImage('output.png');
console.log('Base64-encoded Image Content:', imageContent);
```

## Class Properties
- filePath: The file path of the HTML file to be converted.
- encoding: The encoding of the HTML file. Defaults to 'utf-8'.
- content: An object containing key-value pairs for replacing placeholders in the HTML content.
- Dependencies
- puppeteer: Headless Chrome browser automation library.
  
## Contributing
Feel free to contribute by opening issues or submitting pull requests. Contributions are welcome!

## License
This project is licensed under the MIT License.

#### made with 💘 by Ayomikun Faluyi






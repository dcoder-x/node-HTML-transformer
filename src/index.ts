

const fs = require("fs/promises")
const puppeteer = require("puppeteer")
const path = require("path")

/**
 * Converts HTML content to an image using puppeteer.
 * @param {string} htmlContent - The HTML content to be converted to an image.
 * @param {string} outputPath - The path where the image will be saved.
 * @returns {Promise<string>} - A Promise that resolves with the base64-encoded image content.
 */
async function convertHTMLToImage(htmlContent: string): Promise<string> {
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();

  try {
    // Set content to the HTML
    await page.setContent(htmlContent);

    // Capture a screenshot directly into a buffer
    const screenshotBuffer = await page.screenshot();

    // Save the buffer content as base64
    const base64Image = screenshotBuffer.toString('base64');

    console.log(`Image captured and converted to base64`);

    return base64Image;
  } finally {
    await browser.close();
  }
}


/**
 * Class representing HTML conversion operations.
 */
class ConvertHTML {
  /**
   * The file path of the HTML file to be converted.
   */
  private filePath: string;

  /**
   * The encoding of the HTML file. Defaults to 'utf-8'.
   */
  private encoding: string;

  /**
   * An object containing key-value pairs for replacing placeholders in the HTML content.
   */
  private content: object;

  /**
   * Constructs a new instance of the ConvertHTML class.
   * @param {string} filePath - The file path of the HTML file to be converted.
   * @param {string} [encoding='utf-8'] - The encoding of the HTML file. Defaults to 'utf-8'.
   * @param {object} [content={}] - An object containing key-value pairs for replacing placeholders in the HTML content.
   */
  constructor(filePath: string, encoding: string = 'utf-8', content: object = {}) {
    this.filePath = filePath;
    this.encoding = encoding;
    this.content = content;
  }

  /**
   * Converts the HTML content to a string with replaced placeholders.
   * @returns {Promise<string>} - A Promise that resolves with the converted HTML content.
   */
  toString = async (): Promise<string> => {
    try {
      // Resolve the absolute path to the HTML file
      const absolutePath: string = path.resolve(this.filePath);

      // Read the HTML file content
      let htmlContent: string = await fs.readFile(absolutePath,this.encoding as BufferEncoding );
      let newHtmlConent:string;

      if (Object.keys(this.content).length > 0) {
        Object.entries(this.content).forEach(([key, value]) => {
          newHtmlConent = htmlContent.replace(`{{${key}}}`, `${value}`);
        });

        return newHtmlConent;
      }

      return htmlContent;
    } catch (error) {
      console.error('Error reading HTML file:', error.message);
      throw error;
    }
  };

  /**
   * Converts the HTML content to a PDF file.
   * @param {string} outputPath - The path where the PDF file will be saved.
   * @returns {Promise<string>} - A Promise that resolves with the base64-encoded PDF content.
   */
  toPDF = async (outputPath: string): Promise<string> => {
    try {
      const htmlContent = await this.toString();
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      try {
        // Set content to the HTML
        await page.setContent(htmlContent);

        // Generate PDF
        const  pdfBuffer = await page.pdf({ format: 'A4' });

        console.log(`PDF saved to ${outputPath}`);

        // Read the PDF file and return the base64-encoded content directly
        const encodedPDF = pdfBuffer.toString("base64");
        return encodedPDF;
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error('Error converting HTML to PDF:', error.message);
      throw error;
    }
  };

  /**
   * Converts the HTML content to an image.
   * @param {string} outputPath - The path where the image will be saved.
   * @returns {Promise<string>} - A Promise that resolves with the base64-encoded image content.
   */
  toImage = async (): Promise<string> => {
    try {
      const htmlContent = await this.toString();
      return await convertHTMLToImage(htmlContent);
    } catch (error) {
      console.error('Error converting HTML to image:', error.message);
      throw error;
    }
  };
}

module.exports= ConvertHTML;

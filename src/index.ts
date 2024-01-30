import * as puppeteer from "puppeteer";
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Converts HTML content to an image using puppeteer.
 * @param {string} htmlContent - The HTML content to be converted to an image.
 * @param {string} outputPath - The path where the image will be saved.
 * @returns {Promise<string>} - A Promise that resolves with the base64-encoded image content.
 */
async function convertHTMLToImage(htmlContent: string, outputPath: string): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Set content to the HTML
    await page.setContent(htmlContent);

    // Capture a screenshot
    await page.screenshot({ path: outputPath });

    console.log(`Image saved to ${outputPath}`);

    return await fs.readFile(outputPath, 'base64');
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
  filePath: string;

  /**
   * The encoding of the HTML file. Defaults to 'utf-8'.
   */
  encoding: string;

  /**
   * An object containing key-value pairs for replacing placeholders in the HTML content.
   */
  content: object;

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


      if (Object.keys(this.content).length > 0) {
        Object.entries(this.content).forEach(([key, value]) => {
          htmlContent = htmlContent.replace(`{{${key}}}`, `${value}`);
        });

        return htmlContent;
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
        await page.pdf({ path: outputPath, format: 'A4' });

        console.log(`PDF saved to ${outputPath}`);

        // Read the PDF file and return the base64-encoded content directly
        const encodedPDF = await fs.readFile(outputPath, 'base64');
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
  toImage = async (outputPath: string): Promise<string> => {
    try {
      const htmlContent = await this.toString();
      return await convertHTMLToImage(htmlContent, outputPath);
    } catch (error) {
      console.error('Error converting HTML to image:', error.message);
      throw error;
    }
  };
}

export default ConvertHTML;

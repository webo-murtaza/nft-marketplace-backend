import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProductsDto } from './dto/create-products.dto';
import { ImageServiceService } from '../services/image-service.service';
import { ProductsService } from './products.service';

export const storage = diskStorage({
  destination: './public/samples',
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file) {
  return `${Date.now()}_${file.originalname}`;
}

@Controller('products')
@ApiTags('Products Management')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productService: ProductsService, private readonly imageUploadService: ImageServiceService) {

  }

  @ApiOperation({ summary: 'L Listing', description: '' })
  @Get()
  async findAll() {
    try {
      const productsData = await this.productService.getProducts();
      return {
        success: true,
        code: 200,
        message: 'Products have been retrieved.',
        data: {
          products: productsData[0],
        },
      };
    } catch (error) {
      return {
        success: false,
        code: 201,
        message: error,
      };
    }
  }

  @ApiOperation({ summary: 'C Create', description: '' })
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        attachment: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        wallet_address: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('attachment'))
  async create(
    @UploadedFile() attachment,
    @Body() createProductDto: CreateProductsDto,
  ) {
    try {
      if (createProductDto.name == '' || createProductDto.wallet_address == '' || !attachment) {
        throw 'Please enter required fields';
      }

      //@ts-ignore
      createProductDto.attachment = attachment ? await this.imageUploadService.upload('samples', attachment) : '';
      const response = await this.productService.create(createProductDto);
      return {
        success: true,
        code: 200,
        message: 'Product has been created.',
        data: {
          product: response,
        },
      };
    } catch (error) {
      return {
        success: false,
        code: 201,
        message: error,
      };
    }
  }

  @ApiOperation({ summary: 'R Read JSON', description: '' })
  @Get('json/:id')
  async getProductJson(@Param('id') id: number): Promise<object> {
    try {
      let product = await this.productService.getProductById({ 'token_id': id });
      return {
        name: product.name,
        description: product.description,
        image: product.attachment,
      };
    } catch (error) {
      return {
        success: false,
        code: 201,
        message: error,
      };
    }
  }

  @ApiOperation({ summary: 'R Read', description: '' })
  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<object> {
    try {
      let product = await this.productService.getProductById({ id });
      return {
        success: true,
        code: 200,
        message: 'Product has been retrieved.',
        data: {
          product,
        },
      };
    } catch (error) {
      return {
        success: false,
        code: 201,
        message: error,
      };
    }
  }

  @ApiOperation({ summary: 'U Update', description: '' })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: any,
  ) {
    try {
      await this.productService.updateProductById(id, payload);
      return {
        success: true,
        code: 200,
        message: 'Product has been updated.',
      };
    } catch (error) {
      return {
        success: false,
        code: 201,
        message: error,
      };
    }
  }
}

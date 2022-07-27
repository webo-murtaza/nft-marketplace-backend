import { Injectable } from '@nestjs/common';
import { CreateProductsDto } from './dto/create-products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {
    //
  }

  async getProducts() {
    return await this.productRepository.createQueryBuilder('products').getManyAndCount();
  }

  async create(createProductsDto: CreateProductsDto) {
    const product = new ProductEntity();
    product.wallet_address = createProductsDto.wallet_address;
    product.name = createProductsDto.name;
    product.description = createProductsDto.description;
    product.attachment = createProductsDto.attachment;
    return await this.productRepository.save(product);
  }

  async getProductById(query: FindConditions<ProductEntity>) {
    return await this.productRepository.findOneOrFail(query);
  }

  async updateProductById(id, payload) {
    await this.productRepository.createQueryBuilder('products').update().set(payload).where('id=:id', { id }).execute();
  }
}

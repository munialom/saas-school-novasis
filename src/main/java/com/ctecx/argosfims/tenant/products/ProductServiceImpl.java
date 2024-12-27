package com.ctecx.argosfims.tenant.products;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Md. Amran Hossain
 */
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductRepository productRepository;

    @Override
    @Transactional
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }
}

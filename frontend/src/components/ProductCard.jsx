import React from 'react';
import Button from './Button';

const ProductCard = ({ product, onEdit, onDelete }) => {

  function stripHtmlTags(html) {
    // Parse HTML string and remove tags
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || " ";
  }

  return (
    <div className="bg-white  rounded-lg overflow-hidden shadow-md">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{stripHtmlTags(product.body_html)}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold">${product?.variants[0].price}</div>
          <div className="text-gray-500 dark:text-gray-400">{product?.variants[0].inventory_quantity}</div>
        </div>
        <div className="mt-auto flex gap-2">
          <Button onClick={() => onEdit(product)}
          className="btn-primary" variant="outline"
          >
            Edit
          </Button>
          <Button onClick={() => onDelete(product.id)} className="btn-danger" variant="danger">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


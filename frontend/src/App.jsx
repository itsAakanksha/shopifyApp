import React, { useState, useEffect } from "react";
import Button from "./components/Button.jsx";
import ProductCard from "./components/ProductCard.jsx";
import Dialog from "./components/Dialog.jsx";
import Pagination from "./components/Pagination.jsx";
import FormField from "./components/FormField.jsx";
import SearchIcon from "./components/SearchIcon.jsx";

function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: "",
    title: "",
    body_html: "",
    variants: [
      {
        price: 0,
        inventory_quantity: 0,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://shopifyapp-production-ae3c.up.railway.app/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [newProduct]); // Update products list when new product is added

  const handleSaveNewProduct = async () => {
    try {
      const response = await fetch("https://shopifyapp-production-ae3c.up.railway.app/createproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product: newProduct }),
      });
      if (!response.ok) {
        throw new Error("Failed to create product");
      }
      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({
        id: "",
        title: "",
        body_html: "",
        variants: [
          {
            price: 0,
            inventory_quantity: 0,
          },
        ],
      });
      setShowAddProductModal(false);
    } catch (error) {
      console.error("Error creating product:", error.message);
    }
  };

  const handleSaveEditedProduct = async () => {
    try {
      const response = await fetch(
        `https://shopifyapp-production-ae3c.up.railway.app/update/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingProduct),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      const data = await response.json();
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? data : product
        )
      );
      setEditingProduct(null);
      setShowEditProductModal(false);
    } catch (error) {
      console.error("Error updating product:", error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `https://shopifyapp-production-ae3c.up.railway.app/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset current page to 1 when searching
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-100 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Button
            onClick={() => setShowAddProductModal(true)}
            className="btn-primary"
          >
            Add Product
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 rounded-md bg-white dark:bg-gray-800 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      <Dialog
        open={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      >
        <div className="sm:max-w-[425px] p-6 bg-white rounded-md shadow-md">
          <h2 className="text-xl font-semibold">Add Product</h2>
          <p className="text-gray-500">
            Fill in the details for the new product.
          </p>
          <div className="grid gap-4 py-4">
            <FormField
              label="Title"
              id="title"
              value={newProduct.title}
              onChange={(e) =>
                setNewProduct({ ...newProduct, title: e.target.value })
              }
            />
            <FormField
              label="Description"
              id="description"
              type="textarea"
              value={newProduct.body_html}
              onChange={(e) =>
                setNewProduct({ ...newProduct, body_html: e.target.value })
              }
            />
            <FormField
              label="Price"
              id="price"
              type="number"
              value={newProduct.variants[0].price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  variants: [
                    {
                      ...newProduct.variants[0],
                      price: parseFloat(e.target.value),
                    },
                  ],
                })
              }
            />
            <FormField
              label="Inventory"
              id="inventory"
              type="number"
              value={newProduct.variants[0].inventory_quantity}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  variants: [
                    {
                      ...newProduct.variants[0],
                      inventory_quantity: parseInt(e.target.value),
                    },
                  ],
                })
              }
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button className="btn-primary" onClick={handleSaveNewProduct}>
              Save
            </Button>
            <Button
              className="btn-outline"
              variant="danger"
              onClick={() => setShowAddProductModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>

      {editingProduct && (
        <Dialog
          open={showEditProductModal}
          onClose={() => setShowEditProductModal(false)}
        >
          <div className="sm:max-w-[425px] p-6 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-semibold">Edit Product</h2>
            <p className="text-gray-500">
              Update the details for the selected product.
            </p>
            <div className="grid gap-4 py-4">
              <FormField
                label="Title"
                id="title"
                value={editingProduct.title}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    title: e.target.value,
                  })
                }
              />
              <FormField
                label="Description"
                id="description"
                type="textarea"
                value={editingProduct.body_html}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    body_html: e.target.value,
                  })
                }
              />
             
              <FormField
                label="Price"
                id="price"
                type="number"
                value={editingProduct.variants[0].price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    variants: [
                      {
                        ...editingProduct.variants[0],
                        price: parseFloat(e.target.value),
                      },
                    ],
                  })
                }
              />
              <FormField
                label="Inventory"
                id="inventory"
                type="number"
                value={editingProduct.variants[0].inventory_quantity}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    variants: [
                      {
                        ...editingProduct.variants[0],
                        inventory_quantity: parseInt(e.target.value),
                      },
                    ],
                  })
                }
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button className="btn-primary" onClick={handleSaveEditedProduct}>
                Save
              </Button>
              <Button
                className="btn-outline"
                variant="danger"
                onClick={() => setShowEditProductModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default App;

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Plus, Trash2, Search, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface Product {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  active: boolean;
}

const INITIAL_FORM_DATA = {
  name: "",
  slug: "",
  basePrice: "",
  active: true,
};

export default function ProductsPage() {
  // State
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const [isFetching, setIsFetching] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [searchProduct, setSearchProduct] = useState("");

  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToUpdate, setProductToUpdate] = useState<string | null>(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // Fetch Products
  const getAllProducts = useCallback(async () => {
    try {
      setIsFetching(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/product/get-products`,
      );
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  // Form Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, active: value === "true" }));
  };

  // Reset form when dialogs close
  const handleCreateOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setFormData(INITIAL_FORM_DATA);
  };

  const handleUpdateOpenChange = (isOpen: boolean) => {
    setUpdateOpen(isOpen);
    if (!isOpen) {
      setFormData(INITIAL_FORM_DATA);
      setProductToUpdate(null);
    }
  };

  // Open Edit Modal & Populate Data
  const handleEditClick = (product: Product) => {
    setProductToUpdate(product._id);
    setFormData({
      name: product.name,
      slug: product.slug,
      basePrice: String(product.basePrice),
      active: product.active,
    });
    setUpdateOpen(true);
  };

  // Create Product
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("basePrice", String(formData.basePrice));
    payload.append("active", String(formData.active));

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/product/create-product`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (res.status === 201 || res.status === 200) {
        toast.success(res.data.message);
        handleCreateOpenChange(false);
        getAllProducts();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Product
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToUpdate) return;

    setIsUpdateLoading(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("slug", formData.slug);
    payload.append("basePrice", formData.basePrice);
    payload.append("active", String(formData.active));

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/product/update-product/${productToUpdate}`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        handleUpdateOpenChange(false);
        getAllProducts();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  // Delete Product
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/product/delete-product/${productToDelete}`,
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        getAllProducts();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setProductToDelete(null);
      setDeleteLoading(false);
    }
  };

  // Filter Search
  const filteredProducts = useMemo(() => {
    const query = searchProduct.toLowerCase().trim();
    if (!query) return products;
    return products.filter((p) => p.name?.toLowerCase().includes(query));
  }, [products, searchProduct]);

  return (
    <div className="min-h-screen w-full bg-background lg:p-8 text-foreground">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory and prices.
            </p>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                className="h-10 pl-9 bg-background"
                placeholder="Search Product Name..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
              />
            </div>

            {/* Create Dialog */}
            <Dialog open={open} onOpenChange={handleCreateOpenChange}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer flex items-center shrink-0">
                  <Plus />
                  Add Product
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                  <DialogTitle>Create Product</DialogTitle>
                  <DialogDescription>
                    Fill in the product details below.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="create-name">Product Name</Label>
                    <Input
                      id="create-name"
                      name="name"
                      placeholder="e.g. Cotton T-Shirt"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="create-price">Base Price (৳)</Label>
                      <Input
                        id="create-price"
                        name="basePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                        value={formData.basePrice}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.active ? "true" : "false"}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Spinner />}
                      {isLoading ? "Creating..." : "Create Product"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Update Dialog */}
            <Dialog open={updateOpen} onOpenChange={handleUpdateOpenChange}>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                  <DialogTitle>Update Product</DialogTitle>
                  <DialogDescription>
                    Update the product details below.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdateSubmit} className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="update-name">Product Name</Label>
                      <Input
                        id="update-name"
                        name="name"
                        placeholder="e.g. Cotton T-Shirt"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="update-slug">Slug</Label>
                      <Input
                        id="update-slug"
                        name="slug"
                        placeholder="e.g. cotton-t-shirt"
                        required
                        value={formData.slug}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="update-price">Base Price (৳)</Label>
                      <Input
                        id="update-price"
                        name="basePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                        value={formData.basePrice}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.active ? "true" : "false"}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      disabled={isUpdateLoading}
                      className="cursor-pointer"
                    >
                      {isUpdateLoading && <Spinner />}
                      {isUpdateLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content Area */}
        {isFetching ? (
          <div className="flex h-[200px] w-full items-center justify-center border rounded-md">
            <Spinner />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="rounded-md border bg-card max-h-screen overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] px-4">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right px-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <TableRow key={product._id || index}>
                    <TableCell className="font-medium px-4 text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {product.slug}
                    </TableCell>
                    <TableCell>
                      ৳{Number(product.basePrice).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {product.active ? (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() => setProductToDelete(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchProduct
                  ? "Try adjusting your search terms."
                  : "Start by adding your first product."}
              </p>
              {!searchProduct && (
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => setOpen(true)}
                >
                  Add Product
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              product and remove data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteLoading}
              onClick={() => setProductToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteLoading}
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteLoading ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

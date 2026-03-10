# TODO: Fix Seller Product Isolation

## Steps to Complete:
- [x] 1. Update Product Model - Add `seller` field (ObjectId reference to User)
- [x] 2. Update products-routes.js - Add authMiddleware to protect routes
- [x] 3. Update addProduct controller - Associate product with seller using req.user.id
- [x] 4. Update fetchAllProducts controller - Filter products by seller's ID from JWT
- [x] 5. Update editProduct controller - Ensure only owner can edit their products
- [x] 6. Update deleteProduct controller - Ensure only owner can delete their products
- [ ] 7. Check if superadmin needs to see all products (optional)
- [ ] 8. Restart server and test


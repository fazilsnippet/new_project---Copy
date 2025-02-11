import React, { useState } from 'react';
import { useGetAdvancedWishlistQuery, useAddProductToWishlistMutation, useRemoveProductFromWishlistMutation } from '../redux/api/wishlistApiSlice';
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Wishlist = () => {
  const { data: wishlist, error, isLoading } = useGetAdvancedWishlistQuery({ userId: 'user123' });
  const [addProductToWishlist] = useAddProductToWishlistMutation();
  const [removeProductFromWishlist] = useRemoveProductFromWishlistMutation();
  const [newProductId, setNewProductId] = useState('');

  const handleAddProduct = async () => {
    try {
      await addProductToWishlist({ userId: 'user123', productId: newProductId }).unwrap();
      setNewProductId('');
    } catch (err) {
      console.error('Failed to add product to wishlist: ', err);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await removeProductFromWishlist({ userId: 'user123', productId }).unwrap();
    } catch (err) {
      console.error('Failed to remove product from wishlist: ', err);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error loading wishlist</Alert>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Wishlist</Typography>
      <List>
        {wishlist?.map((product) => (
          <ListItem key={product.id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveProduct(product.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={product.name} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Enter product ID"
        variant="outlined"
        value={newProductId}
        onChange={(e) => setNewProductId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddProduct}>Add to Wishlist</Button>
    </Container>
  );
};

export default Wishlist;
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function uploadImages(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'images.*' => 'required|file|mimes:jpeg,png,webp,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            $urls = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('public/products');
                    $urls[] = Storage::url($path);
                }
            }

            return response()->json([
                'success' => true,
                'urls' => $urls,
                'message' => 'Images uploaded successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error uploading images: ' . $e->getMessage()
            ], 500);
        }
    }

    public function storeVariants(Request $request, $productId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'variants' => 'required|array',
                'variants.*.price' => 'required|numeric|min:0',
                'variants.*.stock' => 'required|integer|min:0',
                'variants.*.attribute_values' => 'required|array',
                'variants.*.images' => 'required|array',
                'variants.*.images.*' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Save variants logic here...

            return response()->json([
                'success' => true,
                'message' => 'Product variants saved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving variants: ' . $e->getMessage()
            ], 500);
        }
    }
}

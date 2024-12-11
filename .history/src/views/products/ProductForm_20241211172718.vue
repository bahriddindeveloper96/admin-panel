# Yuqoridagi Vue komponenti kodini o'zgartirmasdan saqlaymiz, faqat
handleImageUpload metodini o'zgartiramiz:

<template>
  <!-- Yuqoridagi template kodi o'zgarishsiz qoladi -->
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "ProductForm",

  setup() {
    const router = useRouter();
    const currentLang = ref("en");

    // Initialize form with predefined structure
    const form = reactive({
      category_id: "",
      user_id: 1, // Default user_id
      slug: "",
      active: true,
      featured: false,
      attributes: {
        Brand: "",
        "Display Size": "",
        "Display Resolution": "",
        Processor: "",
        "Main Camera": "",
        "Front Camera": "",
        "Battery Capacity": "",
        "Fast Charging": false,
        "5G Support": false,
        NFC: false,
        "Wireless Charging": false,
        "Water Resistance": "",
      },
      translations: {
        en: { name: "", description: "" },
        ru: { name: "", description: "" },
        uz: { name: "", description: "" },
      },
      variants: [],
    });

    const categories = ref([]);
    const uploadedFiles = ref([]); // Yangi qo'shilgan

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/admin/categories");
        categories.value = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const handleImageUpload = async (event, variantIndex) => {
      const files = event.target.files;
      const formData = new FormData();

      // Fayllarni formData ga qo'shamiz
      Array.from(files).forEach((file) => {
        formData.append("images[]", file);
      });

      formData.append("product_id", form.id); // Agar mavjud bo'lsa
      formData.append("variant_id", form.variants[variantIndex].id); // Agar mavjud bo'lsa

      try {
        const response = await axios.post(
          "/admin/products/upload-images",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Variant rasmlarini yangilaymiz
        if (response.data.status === "success") {
          if (!form.variants[variantIndex].images) {
            form.variants[variantIndex].images = [];
          }
          form.variants[variantIndex].images = [
            ...form.variants[variantIndex].images,
            ...response.data.data.images,
          ];
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Failed to upload images",
        });
      }
    };

    const removeImage = (variantIndex, imageIndex) => {
      form.variants[variantIndex].images.splice(imageIndex, 1);
    };

    const addVariant = () => {
      form.variants.push({
        attribute_values: {
          RAM: "",
          Storage: "",
          Color: "",
        },
        price: 0,
        stock: 0,
        images: [], // Yangi qo'shilgan
      });
    };

    const removeVariant = (index) => {
      form.variants.splice(index, 1);
    };

    const handleSubmit = async () => {
      try {
        // Validate if at least one variant exists
        if (form.variants.length === 0) {
          form.variants.push({
            attribute_values: {
              RAM: "",
              Storage: "",
              Color: "",
            },
            price: 0,
            stock: 0,
            images: [], // Yangi qo'shilgan
          });
        }

        // Ensure all variants have price and stock
        form.variants.forEach((variant) => {
          if (!variant.price) variant.price = 0;
          if (!variant.stock) variant.stock = 0;
        });

        const response = await axios.post("/admin/products", form);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product has been created successfully.",
        });

        router.push("/admin/products");
      } catch (error) {
        console.error("Error creating product:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Something went wrong!",
        });
      }
    };

    // Fetch categories when component mounts
    fetchCategories();

    return {
      form,
      categories,
      currentLang,
      handleImageUpload,
      removeImage,
      addVariant,
      removeVariant,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.card-tools {
  position: absolute;
  right: 1rem;
  top: 0.5rem;
}
</style>

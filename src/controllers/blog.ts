import { Request, Response } from "express";
import Blog from "../models/blog";
import mongoose from "mongoose";

// Create new blog with two image options
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, description, image, thumbnailImage, tags, date, content, status } = req.body;
    const user = (req as any).user;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Use thumbnailImage if provided, otherwise use main image
    const blogImage = thumbnailImage || image;

    const blog = await Blog.create({
      title,
      slug,
      description,
      image: blogImage,
      thumbnailImage: thumbnailImage || null, // Store both images
      tags: tags || [],
      date: date || new Date().toISOString().split('T')[0],
      author: user.id,
      content: content || "",
      status: status || "draft"
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    
    // Handle status changes
    if (updateData.status === "published" && !req.body.publishedAt) {
      updateData.publishedAt = new Date();
    }
    
    // Use thumbnailImage if provided for image field
    if (updateData.thumbnailImage) {
      updateData.image = updateData.thumbnailImage;
    }
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("author", "username email");

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get blog by ID or slug
export const getBlog = async (req: Request, res: Response) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.id) 
      ? { _id: req.params.id }
      : { slug: req.params.id };

    const blog = await Blog.findOne(query)
      .populate("author", "username email")
      .lean();

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Format response to match UI structure
    const formattedBlog = {
      id: blog._id.toString(),
      title: blog.title,
      description: blog.description,
      image: blog.image,
      thumbnailImage: blog.thumbnailImage, // Include both images
      tags: blog.tags,
      date: blog.date,
      createdAt: blog.createdAt.toISOString(),
      status: blog.status,
      content: blog.content
    };

    res.json(formattedBlog);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get all blogs with filters (admin only) - matches UI structure
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 10, 
      search,
      tag 
    } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const filter: any = {};
    
    if (status) filter.status = status;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const blogs = await Blog.find(filter)
      .populate("author", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
      .lean();

    // Format blogs to match UI structure
    const formattedBlogs = blogs.map(blog => ({
      id: blog._id.toString(),
      title: blog.title,
      description: blog.description,
      image: blog.image,
      thumbnailImage: blog.thumbnailImage, // Include both images
      tags: blog.tags,
      date: blog.date,
      createdAt: blog.createdAt.toISOString(),
      status: blog.status,
      author: blog.author
    }));

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs: formattedBlogs,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get published blogs for frontend - simplified
export const getPublishedBlogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 9, tag } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const filter: any = { status: "published" };
    if (tag) filter.tags = tag;

    const blogs = await Blog.find(filter)
      .select("title description image thumbnailImage tags date createdAt")
      .populate("author", "username")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
      .lean();

    // Format blogs
    const formattedBlogs = blogs.map(blog => ({
      id: blog._id.toString(),
      title: blog.title,
      description: blog.description,
      image: blog.image,
      thumbnailImage: blog.thumbnailImage, // Include both
      tags: blog.tags,
      date: blog.date,
      createdAt: blog.createdAt.toISOString()
    }));

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs: formattedBlogs,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
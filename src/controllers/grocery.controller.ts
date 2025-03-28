import { Request, Response } from "express";
import { prisma } from '../config/prisma';
import * as _ from 'underscore';
import { uniqBy } from 'lodash';


/**
 * Add new grocery item (Admin only)
 */
export const addGrocery = async (req: Request, res: Response): Promise<any> => {
    try {
        let { groceries } = req.body;

        if (!groceries || !Array.isArray(groceries) || groceries.length === 0) {
            return res.status(400).json({ message: "Invalid input. Expected an array of groceries." });
        }
        const isValid = _.every(groceries, (grocery) =>
            grocery.name && grocery.price && grocery.stock && grocery.unit
        );

        if (!isValid) {
            return res.status(400).json({ message: "Each grocery must have name, price, stock, and unit." });
        }

        let processedGroceries = [];

        for (const grocery of groceries) {
            const { name, price, stock, unit } = grocery;

            // Check if the grocery already exists
            const existingGrocery = await prisma.grocery.findUnique({
                where: { name },
            });

            if (existingGrocery) {
                // Update stock if item exists
                const updatedGrocery = await prisma.grocery.update({
                    where: { name },
                    data: { stock: existingGrocery.stock + stock, price },
                });
                processedGroceries.push(updatedGrocery);
            } else {
                // Create a new grocery item
                const newGrocery = await prisma.grocery.create({
                    data: { name, price, stock, unit },
                });
                processedGroceries.push(newGrocery);
            }
        }
        processedGroceries = uniqBy(groceries, "name");
        return res.status(201).json({
            message: "Groceries processed successfully!",
            groceries: processedGroceries,
        });
    } catch (error) {
        console.error("Error adding/updating groceries:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

/**
 * View all grocery items (Both Admin & User)
 */
export const getGroceries = async (req: Request, res: Response): Promise<any> => {
    try {
        const { searchFilter, limit = 10, offset = 0, sortBy = "name", sortOrder = "asc" } = req.query;

        // Create filter object
        const contextFilter: any = {};
        let filterObject: any = {};
        if (searchFilter && typeof searchFilter === "string") {
            try {
                filterObject = JSON.parse(searchFilter);
            } catch (error) {
                return res.status(400).json({ message: "Invalid searchFilter format. Use JSON object." });
            }
        }

        if (filterObject.name) {
            contextFilter.name = { contains: filterObject.name.toLowerCase() };
        }

        // Fetch groceries with filter, pagination, and sorting
        const groceries = await prisma.grocery.findMany({
            where: contextFilter,
            take: Number(limit), // Limit results
            skip: Number(offset), // Offset for pagination
            orderBy: { [sortBy as string]: sortOrder === "desc" ? "desc" : "asc" } // Sorting
        });

        // Get total count for pagination
        const totalCount = await prisma.grocery.count({ where: contextFilter });

        return res.status(200).json({ groceries, totalCount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};


/**
 * Update grocery details (Admin only)
 */
export const updateGrocery = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, price, stock } = req.body;

        const grocery = await prisma.grocery.update({
            where: { id: Number(id) },
            data: { name, price, stock },
        });

        return res.status(200).json({ message: "Grocery item updated successfully", grocery });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

/**
 * Remove grocery item (Admin only)
 */
export const deleteGrocery = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        await prisma.grocery.delete({ where: { id: Number(id) } });

        return res.status(200).json({ message: "Grocery item removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const manageInventory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params; // Grocery ID from URL
        const { action, stock } = req.body; // Action type, Stock amount & Price

        // Find grocery item
        const grocery = await prisma.grocery.findUnique({ where: { id: Number(id) } });
        if (!grocery) {
            return res.status(404).json({ message: "Grocery item not found." });
        }

        let updateData: any = {};

        if (!["increase", "decrease", "set"].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Use 'increase', 'decrease', or 'set'." });
        }
        // Handle stock updates
        if (typeof stock !== "number" || stock < 0) {
            return res.status(400).json({ message: "Stock must be a positive number." });
        }

        let newStock = grocery.stock;
        if (action === "increase") {
            newStock += stock; // Add stock
        } else if (action === "decrease") {
            newStock = Math.max(0, grocery.stock - stock); // Prevent negative stock
        } else if (action === "set") {
            newStock = stock; // Directly set stock
        }

        updateData.stock = newStock;

        // Update grocery item in DB
        const updatedGrocery = await prisma.grocery.update({
            where: { id: grocery.id },
            data: updateData,
        });

        return res.status(200).json({ message: "Grocery updated successfully.", grocery: updatedGrocery });
    } catch (error) {
        console.error("Error updating inventory or price:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

import { promises as fs } from 'fs'

export async function getFileInfo(filePath: string) : Promise<Number> {
    try {
        const stats = await fs.stats(filePath)
        return stats.size
    } catch (error) {
        console.warn(`Failed to fetch file info for ${filePath}`)
        console.error(error)
    }
}
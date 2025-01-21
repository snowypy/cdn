import { promises as fs } from 'fs'

export async function getFileInfo(filePath: string) {
    try {
        const stats = await fs.stat(filePath)
        return stats.size
    } catch (error) {
        console.warn(`Failed to fetch file info for ${filePath}`)
        console.error(error)
    }
}
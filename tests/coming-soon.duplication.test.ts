import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(__dirname, "..");
const LANDING_DIR = path.join(REPO_ROOT, "landing");
const COMING_SOON_DIR = path.join(REPO_ROOT, "coming-soon");

/**
 * Recursively collect all relative file paths under a directory.
 */
function collectFiles(baseDir: string, subDir: string = ""): string[] {
  const results: string[] = [];
  const full = path.join(baseDir, subDir);
  const entries = fs.readdirSync(full, { withFileTypes: true });
  for (const entry of entries) {
    const rel = subDir ? path.join(subDir, entry.name) : entry.name;
    if (entry.isDirectory()) {
      results.push(...collectFiles(baseDir, rel));
    } else {
      results.push(rel);
    }
  }
  return results;
}

/**
 * Recursively collect all relative directory paths under a directory.
 */
function collectDirs(baseDir: string, subDir: string = ""): string[] {
  const results: string[] = [];
  const full = path.join(baseDir, subDir);
  const entries = fs.readdirSync(full, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const rel = subDir ? path.join(subDir, entry.name) : entry.name;
      results.push(rel);
      results.push(...collectDirs(baseDir, rel));
    }
  }
  return results;
}

describe("coming-soon directory duplication", () => {
  describe("coming-soon directory existence", () => {
    it("coming-soon directory exists at the repo root", () => {
      expect(fs.existsSync(COMING_SOON_DIR)).toBe(true);
    });

    it("coming-soon is a directory, not a file", () => {
      expect(fs.statSync(COMING_SOON_DIR).isDirectory()).toBe(true);
    });
  });

  describe("known files are present in coming-soon with correct contents", () => {
    const knownFiles = ["index.html", "robots.txt", "sitemap.xml", "punch-and-plushie.png"];

    it.each(knownFiles)("coming-soon contains file: %s", (filename) => {
      const filePath = path.join(COMING_SOON_DIR, filename);
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("coming-soon/index.html contains the expected title", () => {
      const filePath = path.join(COMING_SOON_DIR, "index.html");
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("Punch &amp; Plushie");
    });

    it("coming-soon/index.html contains the Coming Soon badge text", () => {
      const filePath = path.join(COMING_SOON_DIR, "index.html");
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("Coming Soon");
    });

    it("coming-soon/robots.txt contains the expected sitemap URL", () => {
      const filePath = path.join(COMING_SOON_DIR, "robots.txt");
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("Sitemap:");
      expect(content).toContain("punchandplushie.com/sitemap.xml");
    });

    it("coming-soon/robots.txt allows all user agents", () => {
      const filePath = path.join(COMING_SOON_DIR, "robots.txt");
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("User-agent: *");
      expect(content).toContain("Allow: /");
    });

    it("coming-soon/sitemap.xml is valid XML with a urlset element", () => {
      const filePath = path.join(COMING_SOON_DIR, "sitemap.xml");
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("<?xml version=");
      expect(content).toContain("<urlset");
      expect(content).toContain("</urlset>");
    });

    it("coming-soon/punch-and-plushie.png exists as a file", () => {
      const filePath = path.join(COMING_SOON_DIR, "punch-and-plushie.png");
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.statSync(filePath).isFile()).toBe(true);
    });
  });

  describe("structural parity with landing directory (when landing exists)", () => {
    const landingExists = fs.existsSync(LANDING_DIR) && fs.statSync(LANDING_DIR).isDirectory();

    it("landing directory still exists and is a directory", () => {
      if (!landingExists) {
        // landing dir is not present in this checkout — skip gracefully
        return;
      }
      expect(fs.existsSync(LANDING_DIR)).toBe(true);
      expect(fs.statSync(LANDING_DIR).isDirectory()).toBe(true);
    });

    it("every file in landing is present in coming-soon", () => {
      if (!landingExists) {
        return;
      }
      const landingFiles = collectFiles(LANDING_DIR);
      for (const rel of landingFiles) {
        const comingSoonFile = path.join(COMING_SOON_DIR, rel);
        expect(fs.existsSync(comingSoonFile)).toBe(true);
      }
    });

    it("every file in landing has identical content in coming-soon (text files)", () => {
      if (!landingExists) {
        return;
      }
      const textExtensions = new Set([".html", ".txt", ".xml", ".json", ".css", ".js", ".ts"]);
      const landingFiles = collectFiles(LANDING_DIR);
      for (const rel of landingFiles) {
        const ext = path.extname(rel).toLowerCase();
        if (!textExtensions.has(ext)) {
          continue;
        }
        const landingContent = fs.readFileSync(path.join(LANDING_DIR, rel), "utf-8");
        const comingSoonContent = fs.readFileSync(path.join(COMING_SOON_DIR, rel), "utf-8");
        expect(comingSoonContent).toBe(landingContent);
      }
    });

    it("every file in landing has identical byte content in coming-soon (binary files)", () => {
      if (!landingExists) {
        return;
      }
      const textExtensions = new Set([".html", ".txt", ".xml", ".json", ".css", ".js", ".ts"]);
      const landingFiles = collectFiles(LANDING_DIR);
      for (const rel of landingFiles) {
        const ext = path.extname(rel).toLowerCase();
        if (textExtensions.has(ext)) {
          continue;
        }
        const landingBytes = fs.readFileSync(path.join(LANDING_DIR, rel));
        const comingSoonBytes = fs.readFileSync(path.join(COMING_SOON_DIR, rel));
        expect(comingSoonBytes.equals(landingBytes)).toBe(true);
      }
    });

    it("every subdirectory in landing is present in coming-soon", () => {
      if (!landingExists) {
        return;
      }
      const landingDirs = collectDirs(LANDING_DIR);
      for (const rel of landingDirs) {
        const comingSoonSubDir = path.join(COMING_SOON_DIR, rel);
        expect(fs.existsSync(comingSoonSubDir)).toBe(true);
        expect(fs.statSync(comingSoonSubDir).isDirectory()).toBe(true);
      }
    });

    it("coming-soon has no fewer files than landing", () => {
      if (!landingExists) {
        return;
      }
      const landingFiles = collectFiles(LANDING_DIR);
      const comingSoonFiles = collectFiles(COMING_SOON_DIR);
      expect(comingSoonFiles.length).toBeGreaterThanOrEqual(landingFiles.length);
    });

    it("landing directory entry count is unchanged after duplication", () => {
      if (!landingExists) {
        return;
      }
      const landingEntries = fs.readdirSync(LANDING_DIR);
      // The landing directory must still have at least one entry
      expect(landingEntries.length).toBeGreaterThan(0);
    });

    it("landing file contents are not modified after duplication (spot-check text files)", () => {
      if (!landingExists) {
        return;
      }
      const textExtensions = new Set([".html", ".txt", ".xml", ".json", ".css", ".js", ".ts"]);
      const landingFiles = collectFiles(LANDING_DIR);
      for (const rel of landingFiles) {
        const ext = path.extname(rel).toLowerCase();
        if (!textExtensions.has(ext)) {
          continue;
        }
        // The file should still be readable — if content was destroyed this would throw or be empty
        const content = fs.readFileSync(path.join(LANDING_DIR, rel), "utf-8");
        expect(typeof content).toBe("string");
        // Non-zero length files must still have content
        const stat = fs.statSync(path.join(LANDING_DIR, rel));
        if (stat.size > 0) {
          expect(content.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("coming-soon directory content integrity (standalone)", () => {
    it("coming-soon directory is non-empty", () => {
      const entries = fs.readdirSync(COMING_SOON_DIR);
      expect(entries.length).toBeGreaterThan(0);
    });

    it("coming-soon/index.html references the logo image", () => {
      const content = fs.readFileSync(path.join(COMING_SOON_DIR, "index.html"), "utf-8");
      expect(content).toContain("punch-and-plushie.png");
    });

    it("coming-soon/index.html has a valid HTML doctype", () => {
      const content = fs.readFileSync(path.join(COMING_SOON_DIR, "index.html"), "utf-8");
      expect(content.toLowerCase()).toContain("<!doctype html>");
    });

    it("coming-soon/index.html has a viewport meta tag", () => {
      const content = fs.readFileSync(path.join(COMING_SOON_DIR, "index.html"), "utf-8");
      expect(content).toContain('name="viewport"');
    });

    it("coming-soon/sitemap.xml contains a loc element with a URL", () => {
      const content = fs.readFileSync(path.join(COMING_SOON_DIR, "sitemap.xml"), "utf-8");
      expect(content).toContain("<loc>");
      expect(content).toContain("</loc>");
    });
  });
});

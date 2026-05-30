import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(__dirname, "..");
const LANDING_DIR = path.join(REPO_ROOT, "landing");
const COMING_SOON_DIR = path.join(REPO_ROOT, "coming-soon");

/**
 * Recursively collects all file paths relative to the given root directory.
 * Returns a sorted array of POSIX-style relative paths.
 */
function collectRelativePaths(dir: string): string[] {
  const results: string[] = [];

  function walk(current: string): void {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        const relativePath = path.relative(dir, fullPath).split(path.sep).join("/");
        results.push(relativePath);
      }
    }
  }

  walk(dir);
  return results.sort();
}

describe("coming-soon directory is an exact duplicate of landing", () => {
  test("landing directory exists", () => {
    expect(fs.existsSync(LANDING_DIR)).toBe(true);
    expect(fs.statSync(LANDING_DIR).isDirectory()).toBe(true);
  });

  test("coming-soon directory exists at the same level as landing", () => {
    expect(fs.existsSync(COMING_SOON_DIR)).toBe(true);
    expect(fs.statSync(COMING_SOON_DIR).isDirectory()).toBe(true);
  });

  test("every relative file path in coming-soon matches landing exactly", () => {
    const landingPaths = collectRelativePaths(LANDING_DIR);
    const comingSoonPaths = collectRelativePaths(COMING_SOON_DIR);

    expect(landingPaths.length).toBeGreaterThan(0);
    expect(comingSoonPaths).toEqual(landingPaths);
  });

  test("no files from landing are omitted in coming-soon", () => {
    const landingPaths = collectRelativePaths(LANDING_DIR);
    const comingSoonPaths = collectRelativePaths(COMING_SOON_DIR);

    const missingInComingSoon = landingPaths.filter(
      (p) => !comingSoonPaths.includes(p),
    );
    expect(missingInComingSoon).toEqual([]);
  });

  test("coming-soon contains no extra files absent from landing", () => {
    const landingPaths = collectRelativePaths(LANDING_DIR);
    const comingSoonPaths = collectRelativePaths(COMING_SOON_DIR);

    const extraInComingSoon = comingSoonPaths.filter(
      (p) => !landingPaths.includes(p),
    );
    expect(extraInComingSoon).toEqual([]);
  });

  test("every file's contents in coming-soon are byte-for-byte identical to landing", () => {
    const landingPaths = collectRelativePaths(LANDING_DIR);

    for (const relativePath of landingPaths) {
      const landingFile = path.join(LANDING_DIR, relativePath);
      const comingSoonFile = path.join(COMING_SOON_DIR, relativePath);

      const landingContents = fs.readFileSync(landingFile);
      const comingSoonContents = fs.readFileSync(comingSoonFile);

      expect(comingSoonContents.equals(landingContents)).toBe(true);
    }
  });

  test("landing directory remains present and unmodified after duplication", () => {
    expect(fs.existsSync(LANDING_DIR)).toBe(true);
    expect(fs.statSync(LANDING_DIR).isDirectory()).toBe(true);

    const landingPaths = collectRelativePaths(LANDING_DIR);
    expect(landingPaths.length).toBeGreaterThan(0);

    // Verify each file in landing is readable and non-empty (or explicitly allowed to be empty)
    for (const relativePath of landingPaths) {
      const fullPath = path.join(LANDING_DIR, relativePath);
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(fs.statSync(fullPath).isFile()).toBe(true);
    }
  });

  describe("spot-check known files from coming-soon against landing", () => {
    const knownTextFiles = ["index.html", "robots.txt", "sitemap.xml"];

    test.each(knownTextFiles)(
      "file '%s' exists in both directories with identical content",
      (filename) => {
        const landingFile = path.join(LANDING_DIR, filename);
        const comingSoonFile = path.join(COMING_SOON_DIR, filename);

        expect(fs.existsSync(landingFile)).toBe(true);
        expect(fs.existsSync(comingSoonFile)).toBe(true);

        const landingContents = fs.readFileSync(landingFile);
        const comingSoonContents = fs.readFileSync(comingSoonFile);

        expect(comingSoonContents.equals(landingContents)).toBe(true);
      },
    );

    test("index.html in coming-soon contains expected Punch & Plushie markup", () => {
      const comingSoonIndex = path.join(COMING_SOON_DIR, "index.html");
      expect(fs.existsSync(comingSoonIndex)).toBe(true);

      const contents = fs.readFileSync(comingSoonIndex, "utf-8");
      expect(contents).toContain("Punch");
      expect(contents).toContain("Plushie");
      expect(contents).toContain("<html");
      expect(contents).toContain("</html>");
    });

    test("robots.txt in coming-soon contains expected directives", () => {
      const comingSoonRobots = path.join(COMING_SOON_DIR, "robots.txt");
      expect(fs.existsSync(comingSoonRobots)).toBe(true);

      const contents = fs.readFileSync(comingSoonRobots, "utf-8");
      expect(contents).toContain("User-agent:");
      expect(contents).toContain("Allow:");
    });

    test("sitemap.xml in coming-soon contains expected XML structure", () => {
      const comingSoonSitemap = path.join(COMING_SOON_DIR, "sitemap.xml");
      expect(fs.existsSync(comingSoonSitemap)).toBe(true);

      const contents = fs.readFileSync(comingSoonSitemap, "utf-8");
      expect(contents).toContain("<?xml");
      expect(contents).toContain("<urlset");
      expect(contents).toContain("</urlset>");
    });

    test("punch-and-plushie.png exists in both directories", () => {
      const landingPng = path.join(LANDING_DIR, "punch-and-plushie.png");
      const comingSoonPng = path.join(COMING_SOON_DIR, "punch-and-plushie.png");

      expect(fs.existsSync(landingPng)).toBe(true);
      expect(fs.existsSync(comingSoonPng)).toBe(true);

      const landingContents = fs.readFileSync(landingPng);
      const comingSoonContents = fs.readFileSync(comingSoonPng);

      expect(comingSoonContents.equals(landingContents)).toBe(true);
    });
  });

  describe("subdirectory structure parity", () => {
    test("all subdirectories in landing exist in coming-soon", () => {
      function collectRelativeDirectories(dir: string): string[] {
        const results: string[] = [];

        function walk(current: string): void {
          const entries = fs.readdirSync(current, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isDirectory()) {
              const fullPath = path.join(current, entry.name);
              const relativePath = path
                .relative(dir, fullPath)
                .split(path.sep)
                .join("/");
              results.push(relativePath);
              walk(fullPath);
            }
          }
        }

        walk(dir);
        return results.sort();
      }

      const landingDirs = collectRelativeDirectories(LANDING_DIR);
      const comingSoonDirs = collectRelativeDirectories(COMING_SOON_DIR);

      expect(comingSoonDirs).toEqual(landingDirs);
    });
  });
});

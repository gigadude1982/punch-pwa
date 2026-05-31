import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

interface PackageJson {
  name: string;
  version: string;
  [key: string]: unknown;
}

interface PackageLockPackageEntry {
  name?: string;
  version: string;
  [key: string]: unknown;
}

interface PackageLockJson {
  name: string;
  version: string;
  lockfileVersion: number;
  packages: Record<string, PackageLockPackageEntry>;
  [key: string]: unknown;
}

const EXPECTED_VERSION = "1.0.0";

describe("Application version synchronization", () => {
  let packageJson: PackageJson;
  let packageLockJson: PackageLockJson;

  beforeAll(() => {
    const packageJsonPath = path.join(ROOT, "package.json");
    const packageLockJsonPath = path.join(ROOT, "package-lock.json");

    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageJson;
    packageLockJson = JSON.parse(
      fs.readFileSync(packageLockJsonPath, "utf-8"),
    ) as PackageLockJson;
  });

  describe("package.json", () => {
    it(`has version field set to '${EXPECTED_VERSION}'`, () => {
      expect(packageJson.version).toBe(EXPECTED_VERSION);
    });

    it("has a version field that is a non-empty string", () => {
      expect(typeof packageJson.version).toBe("string");
      expect(packageJson.version.length).toBeGreaterThan(0);
    });
  });

  describe("package-lock.json", () => {
    it(`has top-level version field set to '${EXPECTED_VERSION}'`, () => {
      expect(packageLockJson.version).toBe(EXPECTED_VERSION);
    });

    it(`has root package entry ("") version field set to '${EXPECTED_VERSION}'`, () => {
      const rootPackage = packageLockJson.packages[""];
      expect(rootPackage).toBeDefined();
      expect(rootPackage.version).toBe(EXPECTED_VERSION);
    });

    it("has a top-level version field that is a non-empty string", () => {
      expect(typeof packageLockJson.version).toBe("string");
      expect(packageLockJson.version.length).toBeGreaterThan(0);
    });
  });

  describe("version synchronization across files", () => {
    it("package.json and package-lock.json top-level versions are identical", () => {
      expect(packageJson.version).toBe(packageLockJson.version);
    });

    it("package.json and package-lock.json root package entry versions are identical", () => {
      const rootPackage = packageLockJson.packages[""];
      expect(rootPackage).toBeDefined();
      expect(packageJson.version).toBe(rootPackage.version);
    });

    it("all version fields across both files are synchronized to the same value", () => {
      const rootPackage = packageLockJson.packages[""];
      expect(rootPackage).toBeDefined();

      const versions = [
        packageJson.version,
        packageLockJson.version,
        rootPackage.version,
      ];

      const uniqueVersions = new Set(versions);
      expect(uniqueVersions.size).toBe(1);
      expect(uniqueVersions.has(EXPECTED_VERSION)).toBe(true);
    });
  });
});

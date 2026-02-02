const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Mapping import lama ke import baru
const importMappings = {
  "@/lib/auth/session": "@/lib/auth",
  // Tambahkan mapping lain sesuai kebutuhan
};

// Fungsi untuk check apakah file/folder exists
function checkPathExists(basePath) {
  const projectRoot = process.cwd();
  const fullPath = path.join(projectRoot, "src", basePath.replace("@/", ""));

  // Check berbagai kemungkinan
  const possibilities = [
    fullPath + ".ts",
    fullPath + ".tsx",
    fullPath + ".js",
    fullPath + ".jsx",
    path.join(fullPath, "index.ts"),
    path.join(fullPath, "index.tsx"),
    path.join(fullPath, "index.js"),
    path.join(fullPath, "index.jsx"),
  ];

  for (const p of possibilities) {
    if (fs.existsSync(p)) {
      return true;
    }
  }

  return fs.existsSync(fullPath);
}

// Fungsi untuk mencari file yang mungkin
function findPossibleFile(importPath) {
  const projectRoot = process.cwd();
  const searchPath = importPath.replace("@/", "").split("/");
  const fileName = searchPath[searchPath.length - 1];
  const dirPath = searchPath.slice(0, -1).join("/");

  // Cari di folder yang sama
  const searchPattern = path.join(projectRoot, "src", dirPath, "*");
  const files = glob.sync(searchPattern);

  for (const file of files) {
    const basename = path.basename(file, path.extname(file));
    if (basename.toLowerCase().includes(fileName.toLowerCase())) {
      const relativePath = path.relative(path.join(projectRoot, "src"), file);
      return (
        "@/" +
        relativePath.replace(/\\/g, "/").replace(/\.(ts|tsx|js|jsx)$/, "")
      );
    }
  }

  return null;
}

// Fungsi utama untuk fix imports
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Pattern untuk menangkap imports
  const importPattern =
    /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"](@\/[^'"]+)['"]/g;

  content = content.replace(importPattern, (match, importPath) => {
    // Check apakah ada di mapping manual
    if (importMappings[importPath]) {
      console.log(
        `  📝 ${filePath}: ${importPath} -> ${importMappings[importPath]}`
      );
      modified = true;
      return match.replace(importPath, importMappings[importPath]);
    }

    // Check apakah path exists
    if (!checkPathExists(importPath)) {
      // Coba cari file yang mungkin
      const possiblePath = findPossibleFile(importPath);

      if (possiblePath) {
        console.log(`  🔍 ${filePath}: ${importPath} -> ${possiblePath}`);
        modified = true;
        return match.replace(importPath, possiblePath);
      } else {
        console.log(`  ⚠️  ${filePath}: Cannot resolve ${importPath}`);
      }
    }

    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed imports in ${filePath}`);
  }

  return modified;
}

// Main execution
console.log("🔧 Starting import fix process...\n");

// Cari semua file TypeScript/JavaScript
const files = glob.sync("src/**/*.{ts,tsx,js,jsx}", {
  ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
});

let totalFixed = 0;

for (const file of files) {
  if (fixImports(file)) {
    totalFixed++;
  }
}

console.log(`\n✨ Fixed imports in ${totalFixed} files`);

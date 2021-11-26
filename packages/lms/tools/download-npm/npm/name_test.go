package npm

import "testing"

func TestPackageIdToPackageAndVersion(t *testing.T) {
	tests := []struct {
		name  string
		pkg string 
		wantID  string
		wantVersion string
	}{
		{
			name: "simple",
			pkg: "package-name@1.2.3",
			wantID: "package-name",
			wantVersion: "1.2.3",
		},
		{
			name: "with-author",
			pkg: "@author/package-name@1.2.3",
			wantID: "@author/package-name",
			wantVersion: "1.2.3",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := PackageIdToPackageAndVersion(tt.pkg)
			if got != tt.wantID {
				t.Errorf("PackageIdToPackageAndVersion() got = %v, want %v", got, tt.wantID)
			}
			if got1 != tt.wantVersion {
				t.Errorf("PackageIdToPackageAndVersion() got1 = %v, want %v", got1, tt.wantVersion)
			}
		})
	}
}

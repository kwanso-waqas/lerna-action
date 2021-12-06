package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/illumidesk/lms/tools/download-npm/npm"
	"golang.org/x/sync/errgroup"
)

type todo struct {
	name string
	version string
}

func main() {
	output := flag.String("output", "tmp", "Folder to download files to, defaults to `tmp`")
	flag.Parse()

	inputs := flag.Args()
	if len(inputs) == 0 {
		log.Fatalf("No input packages specified")
	}

	log.Printf("%s", inputs)
	

	todos := make([]todo, len(inputs))
	for i, packageID := range inputs {
		name, ver := npm.PackageIdToPackageAndVersion(packageID)
		todos[i] = todo{name: name, version: ver}
	}

	g := new(errgroup.Group)

	for _, job := range todos {
		job := job // Golang gotcha! Without this it would download the last ID multiple times.

		g.Go(func() error {
			packageID, err := npm.DownloadPackageIntoFolder(job.name, job.version, *output)
			log.Printf("Downloaded %s", packageID)
			return err
		})
	}

	// Wait for all HTTP fetches to complete.
	if err := g.Wait(); err == nil {
		fmt.Println("Successfully fetched all packages.")
	} else {
		log.Fatalf("Something went wrong downloading a package: %v", err)
	}
}
package main

import (
	"os/exec"
	"testing"
)

func TestCmd(t *testing.T) {
	cmd := exec.Command("./kpow")
	err := cmd.Run()

	if err != nil {
		t.Error(err)
	}
}

# Repository agent instructions

## Commit attribution

When committing work on behalf of the repository owner, configure Git before every commit:

```bash
git config user.name "fckaemail-cyber"
git config user.email "f.ckaemail@gmail.com"
```

Do not substitute an agent, bot, service, or temporary email address. Before pushing, verify the author with:

```bash
git show -s --format='%an <%ae>' HEAD
```

Automated workflows that create repository commits must use the same owner identity. Do not rewrite a published default branch unless a dated backup branch exists and the repository owner has explicitly authorized the rewrite.
